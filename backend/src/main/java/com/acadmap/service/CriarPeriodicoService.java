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
                    "Se preencher linkJcr, deve-se preencher percentilJcr e vice‑versa");
        }
        if ((dto.linkScopus() != null) ^ (dto.percentilScopus() != null)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Se preencher linkScopus, deve-se preencher percentilScopus e vice‑versa");
        }
        boolean hasJcrOrScopus = dto.linkJcr() != null || dto.linkScopus() != null;
        if (hasJcrOrScopus && (dto.qualisAntigo() != null)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não pode cadastrar QualisAntigo quando há JCR ou Scopus");
        }
        if (dto.linkGoogleScholar() != null ^ dto.vinculoSBC() != VinculoSBC.sem_vinculo) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Se o periódico tiver vínculo com a SBC, deve-se preencher linkGoogleScholar e vice‑versa");
        }
        try {
            List<Periodico> periodicosSimilares = this.periodicoRepository.findByNomeContainingIgnoreCase(dto.nome());
            if (!periodicosSimilares.isEmpty() && !forcar) {
                    throw new PeriodicoDuplicadoException("Erro de duplicidade de periodico detectado.",
                            periodicosSimilares);
            }

            Set<AreaPesquisa> areasPesquisa = this.carregarAreasPesquisa(dto.areasPesquisaIds());

            Periodico periodico = new Periodico();
            periodico.setIdVeiculo(UUID.randomUUID());
            periodico.setAdequadoDefesa(AdequacaoDefesa.nenhum);
            periodico.setClassificacao(dto.classificacao());
            periodico.setNome(dto.nome());
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
            periodico.setLinkGoogleScholar(dto.linkGoogleScholar());
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
