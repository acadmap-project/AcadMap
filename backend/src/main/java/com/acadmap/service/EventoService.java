package com.acadmap.service;

import com.acadmap.model.AreaPesquisa;
import com.acadmap.model.DTO.EventoCreateDTO;
import com.acadmap.model.Evento;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.model.enums.TipoVeiculo;
import com.acadmap.repository.AreaPesquisaRepository;
import com.acadmap.repository.EventoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashSet;
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
        Set<AreaPesquisa> areasPesquisa = carregarAreasPesquisa(dto.getAreasPesquisaIds());

        Evento evento = new Evento();

        // Atributos da superclasse
        evento.setAdequadoDefesa(dto.getAdequadoDefesa());
        evento.setClassificacao(dto.getClassificacao());
        evento.setNome(dto.getNome());
        evento.setVinculoSbc(dto.getVinculoSbc());
        evento.setTipo(TipoVeiculo.evento);
        evento.setStatus(dto.getStatus() != null ? dto.getStatus() : StatusVeiculo.pendente);
        evento.setAreasPesquisa(areasPesquisa);

        // Atributos específicos
        evento.setH5(dto.getH5());
        evento.setLinkEvento(dto.getLinkEvento());
        evento.setLinkGoogleScholar(dto.getLinkGoogleScholar());
        evento.setLinkSolSbc(dto.getLinkSolSbc());

        return eventoRepository.save(evento);
    }

    private Set<AreaPesquisa> carregarAreasPesquisa(Set<UUID> idsAreasPesquisa) {
        if (idsAreasPesquisa == null || idsAreasPesquisa.isEmpty()) {
            return new HashSet<>();
        }
        return new HashSet<>(areaPesquisaRepository.findAllById(idsAreasPesquisa));
    }

}
