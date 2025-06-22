package com.acadmap.service;

import com.acadmap.exception.periodico.PeriodicoDuplicadoException;
import com.acadmap.model.dto.periodico.PeriodicoResponseDTO;
import com.acadmap.model.dto.periodico.PeriodicoResquestDTO;
import com.acadmap.model.entities.AreaPesquisa;
import com.acadmap.model.entities.Periodico;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.AdequacaoDefesa;
import com.acadmap.model.enums.ClassificacaoVeiculo;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.model.enums.TipoVeiculo;
import com.acadmap.repository.AreaPesquisaRepository;
import com.acadmap.repository.PeriodicoRepository;
import com.acadmap.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CriarPeriodicoService {

    private final AreaPesquisaRepository areaPesquisaRepository;
    private final PeriodicoRepository periodicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RegistrarLogService registrarLogService;

    @Transactional
    public PeriodicoResponseDTO criarPeriodico(PeriodicoResquestDTO dto, UUID uuid){

        try {
            List<Periodico> periodicosSimilares = this.periodicoRepository.findByNomeContainingIgnoreCase(dto.nome());

            if (!dto.forcar() && !periodicosSimilares.isEmpty()) {
                    throw new PeriodicoDuplicadoException("Erro de duplicidade de periodico detectado.",
                            periodicosSimilares);
            }

            Set<AreaPesquisa> areasPesquisa = this.carregarAreasPesquisa(dto.areasPesquisaIds());

            Periodico periodico = new Periodico();
            periodico.setIdVeiculo(UUID.randomUUID());
            periodico.setAdequadoDefesa(AdequacaoDefesa.nenhum);
            periodico.setClassificacao(ClassificacaoVeiculo.a8);
            periodico.setNome(dto.nome());
            periodico.setVinculoSbc(dto.vinculoSBC());
            periodico.setTipo(TipoVeiculo.periodico);
            periodico.setStatus(dto.status() != null ? dto.status() : StatusVeiculo.pendente);
            periodico.setAreasPesquisa(areasPesquisa);
            Usuario usuario = usuarioRepository.findByIdAndFetchProgramaEagerly(uuid).orElseThrow(EntityNotFoundException::new);
            periodico.setUsuario(usuario);

            periodico.setIssn(dto.issn());
            periodico.setPercentil(dto.percentil());
            periodico.setLinkJcr(dto.linkJcr());
            periodico.setLinkScopus(dto.linkScopus());
            periodico.setLinkGoogleScholar(dto.linkGoogleScholar());
            periodico.setQualisAntigo(dto.qualisAntigo());

            Periodico periodicoSavo = this.periodicoRepository.save(periodico);

            this.registrarLogService.registrarCadastroPeriodico(periodicoSavo, usuario);

            return new PeriodicoResponseDTO(periodicoSavo);


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
