package com.acadmap.service;

import com.acadmap.exception.EventoDuplicadoException;
import com.acadmap.model.AreaPesquisa;
import com.acadmap.model.DTO.EventoCreateDTO;
import com.acadmap.model.Evento;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.model.enums.TipoVeiculo;
import com.acadmap.repository.AreaPesquisaRepository;
import com.acadmap.repository.EventoRepository;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class EventoService {

    private final AreaPesquisaRepository areaPesquisaRepository;
    private final EventoRepository eventoRepository;

    public EventoService(AreaPesquisaRepository areaPesquisaRepository,
                         EventoRepository eventoRepository) {
        this.areaPesquisaRepository = areaPesquisaRepository;
        this.eventoRepository = eventoRepository;
    }

    @Transactional
    public Evento criarEvento(EventoCreateDTO dto) {
        try {
            // 🔍 Verificar duplicidade por nome aproximado
            List<Evento> eventosSimilares = eventoRepository.findByNomeContainingIgnoreCase(dto.getNome());
            if (!eventosSimilares.isEmpty()) {
                throw new EventoDuplicadoException("Erro de duplicidade de evento detectado.", eventosSimilares);
            }

            Set<AreaPesquisa> areasPesquisa = carregarAreasPesquisa(dto.getAreasPesquisaIds());

            Evento evento = new Evento();
            evento.setIdVeiculo(UUID.randomUUID());
            evento.setAdequadoDefesa(dto.getAdequadoDefesa());
            evento.setClassificacao(dto.getClassificacao());
            evento.setNome(dto.getNome());
            evento.setVinculoSbc(dto.getVinculoSbc());
            evento.setTipo(TipoVeiculo.evento);
            evento.setStatus(dto.getStatus() != null ? dto.getStatus() : StatusVeiculo.pendente);
            evento.setAreasPesquisa(areasPesquisa);

            evento.setH5(dto.getH5());
            evento.setLinkEvento(dto.getLinkEvento());
            evento.setLinkGoogleScholar(dto.getLinkGoogleScholar());
            evento.setLinkSolSbc(dto.getLinkSolSbc());

            return eventoRepository.save(evento);

        } catch (EventoDuplicadoException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Erro de validação: " + e.getMessage());
        } catch (DataAccessException e) {
            throw new RuntimeException("Erro ao acessar o banco de dados: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Erro inesperado ao criar evento: " + e.getMessage());
        }
    }

    private Set<AreaPesquisa> carregarAreasPesquisa(Set<UUID> idsAreasPesquisa) {
        if (idsAreasPesquisa == null || idsAreasPesquisa.isEmpty()) {
            return new HashSet<>();
        }

        List<AreaPesquisa> areas = areaPesquisaRepository.findAllById(idsAreasPesquisa);

        if (areas.size() != idsAreasPesquisa.size()) {
            throw new IllegalArgumentException("Uma ou mais áreas de pesquisa não foram encontradas.");
        }

        return new HashSet<>(areas);
    }
}
