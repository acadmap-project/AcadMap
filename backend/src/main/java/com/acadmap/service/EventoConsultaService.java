package com.acadmap.service;

import com.acadmap.model.dto.evento.EventoVisualizacaoDTO;
import com.acadmap.model.entities.Evento;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.repository.EventoRepository;
import com.acadmap.model.dto.evento.EventoResumoListaDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class EventoConsultaService {
  private final EventoRepository eventoRepository;

  public EventoVisualizacaoDTO consultaPorId(UUID id) {
    Optional<Evento> eventoOpt = this.eventoRepository.findById(id);

    if (eventoOpt.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "EVENTO_NAO_ENCONTRADO");
    }

    if (!"aceito".equals(String.valueOf(eventoOpt.get().getStatus()))) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "NAO_ACEITO");
    }

    return new EventoVisualizacaoDTO(eventoOpt.get());
  }

  public List<EventoResumoListaDTO> listarAprovados(String nomeFiltro) {
    List<Evento> eventos;

    if (nomeFiltro == null || nomeFiltro.trim().isEmpty()) {
      eventos = eventoRepository.findByStatus(StatusVeiculo.aceito);
    } else {
      eventos = eventoRepository.findByStatusAndNomeContainingIgnoreCase(StatusVeiculo.aceito, nomeFiltro);
    }

    return eventos.stream()
            .map(EventoResumoListaDTO::new)
            .collect(Collectors.toList());
  }

}
