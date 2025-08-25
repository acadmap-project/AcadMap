package com.acadmap.exception;

import com.acadmap.exception.evento.EventoDuplicadoException;
import com.acadmap.exception.periodico.PeriodicoDuplicadoException;
import com.acadmap.exception.pesquisador.PesquisadorUnauthorizedException;
import com.acadmap.exception.veiculo.VeiculoVinculadoException;
import com.acadmap.model.dto.evento.EventoSimplesDTO;
import com.acadmap.model.dto.periodico.PeriodicoSimplesDTO;
import com.acadmap.model.dto.veiculo.VeiculoPublicacaoDTO;
import com.acadmap.model.entities.VeiculoPublicacao;
import com.acadmap.repository.VeiculoPublicacaoRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
@Getter
@AllArgsConstructor
public class GlobalExceptionHandler {

  private final VeiculoPublicacaoRepository veiculoPublicacaoRepository;

  @ExceptionHandler(EventoDuplicadoException.class)
  public ResponseEntity<PersonalizedListResponse<EventoSimplesDTO>> handleEventoDuplicado(
          EventoDuplicadoException ex) {


    var eventosSimples =
            ex.getEventosSimilares().stream().map(EventoSimplesDTO::new).collect(Collectors.toList());

    PersonalizedListResponse<EventoSimplesDTO> response = new PersonalizedListResponse<>(ex.getMessage(), eventosSimples);

    return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
  }

  @ExceptionHandler(PeriodicoDuplicadoException.class)
  public ResponseEntity<PersonalizedListResponse<PeriodicoSimplesDTO>> handlePeriodicoDuplicado(
          PeriodicoDuplicadoException ex) {

    var periodicoSimples =
            ex.getPeriodicosSimilares().stream()
                    .map(PeriodicoSimplesDTO::new)
                    .collect(Collectors.toList());

    PersonalizedListResponse<PeriodicoSimplesDTO> response =
            new PersonalizedListResponse<>(ex.getMessage(), periodicoSimples);

    return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
  }

  @ExceptionHandler(VeiculoVinculadoException.class)
  public ResponseEntity<PersonalizedResponse<VeiculoPublicacaoDTO>> handleVeiculoVinculado(
          VeiculoVinculadoException ex
  ){
    VeiculoPublicacao veiculoPublicacao = veiculoPublicacaoRepository.findAllByFetchVeiculoPublicacaoEagerly(ex.getVeiculoPublicacao().getIdVeiculo())
            .orElseThrow();
    VeiculoPublicacaoDTO veiculoPublicacaoDTO = VeiculoPublicacaoDTO.buildVeiculoDto(veiculoPublicacao);
    PersonalizedResponse<VeiculoPublicacaoDTO> veiculoVinculadoResponse =
            new PersonalizedResponse<>(ex.getMessage(), veiculoPublicacaoDTO);

    return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(veiculoVinculadoResponse);
  }

  @ExceptionHandler(PesquisadorUnauthorizedException.class)
  public ResponseEntity<PersonalizedResponse<VeiculoPublicacaoDTO>> handleUsuarioVinculado(
          PesquisadorUnauthorizedException ex
  ){
    VeiculoPublicacaoDTO veiculoPublicacaoDTO = VeiculoPublicacaoDTO.buildVeiculoDto(ex.getVeiculoPublicacao());
    PersonalizedResponse<VeiculoPublicacaoDTO> personalizedResponse =
            new PersonalizedResponse<>(ex.getMessage(), veiculoPublicacaoDTO);

    return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(personalizedResponse);
  }

}
