package com.acadmap.service;

import com.acadmap.exception.periodico.PeriodicoDuplicadoException;
import com.acadmap.model.dto.periodico.PeriodicoResponseDTO;
import com.acadmap.model.dto.periodico.PeriodicoRequestDTO;
import com.acadmap.model.entities.AreaPesquisa;
import com.acadmap.model.entities.Periodico;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.*;
import com.acadmap.repository.AreaPesquisaRepository;
import com.acadmap.repository.PeriodicoRepository;
import com.acadmap.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class CriarPeriodicoService {

    private final AreaPesquisaRepository areaPesquisaRepository;
    private final PeriodicoRepository periodicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RegistrarLogService registrarLogService;


    public PeriodicoResponseDTO criarPeriodico(PeriodicoRequestDTO dto, UUID uuid, boolean forcar){

        if ((dto.linkJcr() != null) ^ (dto.percentilJcr() != null)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Para JCR, é obrigatório preencher o Link e o Percentil.");
        }
        if ((dto.linkScopus() != null) ^ (dto.percentilScopus() != null)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Para Scopus, é obrigatório preencher o Link e o Percentil.");
        }
        if ((dto.linkGoogleScholar() != null) ^ (dto.h5() != null)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Para Google Scholar, é obrigatório preencher o Link e o h5.");
        }

        boolean temJcr = dto.linkJcr() != null;
        boolean temScopus = dto.linkScopus() != null;
        boolean temGoogleScholar = dto.linkGoogleScholar() != null;
        boolean temQualisAntigo = dto.qualisAntigo() != null;

        if ((temJcr || temScopus) && temGoogleScholar) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não é permitido cadastrar Google Scholar quando JCR e/ou Scopus já foram informados.");
        }

        if ((temJcr || temScopus || temGoogleScholar) && temQualisAntigo) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não é permitido cadastrar Qualis Antigo quando JCR, Scopus ou Google Scholar já foram informados.");
        }

        if (!temJcr && !temScopus && !temGoogleScholar && !temQualisAntigo) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "É obrigatório informar um dos seguintes indicadores: JCR, Scopus, Google Scholar ou Qualis Antigo, respeitando a ordem de prioridade.");
        }
        try {
            List<StatusVeiculo> statusesParaChecar = List.of(StatusVeiculo.pendente, StatusVeiculo.aceito);
            Set<Periodico> periodicosSimilares = new HashSet<>(this.periodicoRepository.findByNomeContainingIgnoreCase(dto.nome()));
            
            // Check for duplicate links
            if (dto.linkGoogleScholar() != null && !dto.linkGoogleScholar().trim().isEmpty()) {
                List<Periodico> periodicosComLinkDuplicado = this.periodicoRepository.findByLinkGoogleScholarAndStatusIn(dto.linkGoogleScholar(), statusesParaChecar);
                periodicosSimilares.addAll(periodicosComLinkDuplicado);
            }
            
            if (dto.linkJcr() != null && !dto.linkJcr().trim().isEmpty()) {
                List<Periodico> periodicosComLinkDuplicado = this.periodicoRepository.findByLinkJcrAndStatusIn(dto.linkJcr(), statusesParaChecar);
                periodicosSimilares.addAll(periodicosComLinkDuplicado);
            }
            
            if (dto.linkScopus() != null && !dto.linkScopus().trim().isEmpty()) {
                List<Periodico> periodicosComLinkDuplicado = this.periodicoRepository.findByLinkScopusAndStatusIn(dto.linkScopus(), statusesParaChecar);
                periodicosSimilares.addAll(periodicosComLinkDuplicado);
            }
            
            if (!periodicosSimilares.isEmpty() && !forcar) {
                    throw new PeriodicoDuplicadoException("Erro de duplicidade de periódico detectado.",
                            new ArrayList<>(periodicosSimilares));
            }

            Set<AreaPesquisa> areasPesquisa = this.carregarAreasPesquisa(dto.areasPesquisaIds());

            Usuario usuario = usuarioRepository.findByIdAndFetchProgramaEagerly(uuid).orElseThrow(EntityNotFoundException::new);

            Periodico periodicoSavo = salvarPeriodico(dto, areasPesquisa, usuario);

            this.registrarLogService.gerarLogVeiculo(periodicoSavo, usuario, AcaoLog.adicao_veiculo);

            return new PeriodicoResponseDTO(periodicoSavo);


        }
        catch (PeriodicoDuplicadoException e){
            throw e;
        }
        catch (IllegalArgumentException e ){
            throw new RuntimeException("Erro de validação: " + e.getMessage());
        } catch (DataAccessException e) {
            throw new RuntimeException("Erro ao acessar o banco de dados: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Erro inesperado ao criar periodico: " + e.getMessage());
        }

    }

    private Set<AreaPesquisa> carregarAreasPesquisa(Set<UUID> idsAreasPesquisa) {
        if (idsAreasPesquisa == null || idsAreasPesquisa.isEmpty()) {
            return new HashSet<>();
        }

        List<AreaPesquisa> areas = this.areaPesquisaRepository.findAllById(idsAreasPesquisa);

        if (areas.size() != idsAreasPesquisa.size()) {
            throw new IllegalArgumentException("Uma ou mais áreas de pesquisa não foram encontradas.");
        }

        return new HashSet<>(areas);
        }

    private Periodico salvarPeriodico(PeriodicoRequestDTO dto, Set<AreaPesquisa> areasPesquisa, Usuario usuario){

        Periodico periodico = new Periodico();
        BeanUtils.copyProperties(dto, periodico, "adequadoDefesa", "tipo", "status", "areasPesquisaIds");
        periodico.setAdequadoDefesa(AdequacaoDefesa.nenhum);
        periodico.setTipo(TipoVeiculo.periodico);
        periodico.setStatus(dto.status() != null ? dto.status() : StatusVeiculo.pendente);
        periodico.setAreasPesquisa(areasPesquisa);
        periodico.setUsuario(usuario);

        return periodicoRepository.save(periodico);

    }

    }
