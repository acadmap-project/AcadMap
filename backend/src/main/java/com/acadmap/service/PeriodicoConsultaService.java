package com.acadmap.service;

import com.acadmap.model.dto.periodico.PeriodicoResumoListaDTO;
import com.acadmap.model.dto.periodico.PeriodicoVisualizacaoDTO;
import com.acadmap.model.dto.veiculo.FiltroVeiculoRequestDTO;
import com.acadmap.model.entities.Periodico;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.repository.PeriodicoRepository;
import com.acadmap.service.specification.VeiculoSpecification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PeriodicoConsultaService {

  private final PeriodicoRepository periodicoRepository;
  private final VeiculoSpecification veiculoSpecification;

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

  public List<PeriodicoResumoListaDTO> listarAprovados(String nomeFiltro) {
    List<Periodico> periodicos;

    if (nomeFiltro == null || nomeFiltro.trim().isEmpty()) {
      periodicos = periodicoRepository.findByStatus(StatusVeiculo.aceito);
    } else {

      periodicos = periodicoRepository.findByStatusAndNomeContainingIgnoreCase(StatusVeiculo.aceito, nomeFiltro);
    }

    return periodicos.stream()
            .map(PeriodicoResumoListaDTO::new)
            .collect(Collectors.toList());
  }

  public List<PeriodicoResumoListaDTO> listarComFiltros(FiltroVeiculoRequestDTO filtro) {
    Specification<Periodico> periodicoSpec = veiculoSpecification.getSpecification(filtro);

    List<Periodico> periodicos = periodicoRepository.findAll(periodicoSpec);

    return periodicos.stream()
            .map(PeriodicoResumoListaDTO::new)
            .collect(Collectors.toList());
  }

}
