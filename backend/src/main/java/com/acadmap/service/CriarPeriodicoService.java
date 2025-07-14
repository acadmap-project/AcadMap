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
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
            List<Periodico> periodicosSimilares = this.periodicoRepository.findByNomeContainingIgnoreCase(dto.nome());
            if (!periodicosSimilares.isEmpty() && !forcar) {
                    throw new PeriodicoDuplicadoException("Erro de duplicidade de periódico detectado.",
                            periodicosSimilares);
            }

            Set<AreaPesquisa> areasPesquisa = this.carregarAreasPesquisa(dto.areasPesquisaIds());

            Periodico periodico = new Periodico();
            periodico.setIdVeiculo(UUID.randomUUID());
            periodico.setAdequadoDefesa(AdequacaoDefesa.nenhum);
            periodico.setClassificacao(dto.classificacao());
            periodico.setNome(dto.nome());
            periodico.setH5(dto.h5());
            periodico.setLinkGoogleScholar(dto.linkGoogleScholar());
            periodico.setVinculoSbc(dto.vinculoSBC());
            periodico.setTipo(TipoVeiculo.periodico);
            periodico.setStatus(dto.status() != null ? dto.status() : StatusVeiculo.pendente);
            periodico.setAreasPesquisa(areasPesquisa);
            Usuario usuario = usuarioRepository.findByIdAndFetchProgramaEagerly(uuid).orElseThrow(EntityNotFoundException::new);
            periodico.setUsuario(usuario);

            periodico.setIssn(dto.issn());
            periodico.setPercentilJcr(dto.percentilJcr());
            periodico.setPercentilScopus(dto.percentilScopus());
            periodico.setLinkJcr(dto.linkJcr());
            periodico.setLinkScopus(dto.linkScopus());
            periodico.setQualisAntigo(dto.qualisAntigo());

            Periodico periodicoSavo = this.periodicoRepository.save(periodico);

            this.registrarLogService.registrarCadastroPeriodico(periodicoSavo, usuario);

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

    }
