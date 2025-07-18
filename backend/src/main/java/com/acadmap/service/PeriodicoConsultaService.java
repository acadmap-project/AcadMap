package com.acadmap.service;

import com.acadmap.model.dto.periodico.PeriodicoVisualizacaoDTO;
import com.acadmap.model.entities.Periodico;
import com.acadmap.repository.PeriodicoRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PeriodicoConsultaService {

  private final PeriodicoRepository periodicoRepository;

  public PeriodicoVisualizacaoDTO consultaPorId(UUID id) {
    Optional<Periodico> periodicoOpt = this.periodicoRepository.findById(id);

    if (periodicoOpt.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "PERIODICO_NAO_ENCONTRADO");
    }

    String status = String.valueOf(periodicoOpt.get().getStatus());
    if (!"aceito".equals(status)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "NAO_ACEITO");
    }

    return new PeriodicoVisualizacaoDTO(periodicoOpt.get());
  }
}
