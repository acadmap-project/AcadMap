package com.acadmap.exception;

import com.acadmap.model.dto.EventoSimplesDTO;
import com.acadmap.model.dto.PeriodicoSimplesDTO;
import com.acadmap.model.dto.VeiculoPublicacaoDTO;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.stream.Collectors;

@ControllerAdvice
@Getter
public class GlobalExceptionHandler {

  @ExceptionHandler(EventoDuplicadoException.class)
  public ResponseEntity<EventoDuplicadoResponse> handleEventoDuplicado(
          EventoDuplicadoException ex) {

    // Converte os eventos da exceção para EventoSimplesDTO
    var eventosSimples =
            ex.getEventosSimilares().stream().map(EventoSimplesDTO::new).collect(Collectors.toList());

    EventoDuplicadoResponse response = new EventoDuplicadoResponse(ex.getMessage(), eventosSimples);

    return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
  }

  @ExceptionHandler(PeriodicoDuplicadoException.class)
  public ResponseEntity<PeriodicoDuplicadoResponse> handlePeriodicoDuplicado(
          PeriodicoDuplicadoException ex) {

    // Converte os Periodico para DTO
    var periodicoSimples =
            ex.getPeriodicosSimilares().stream()
                    .map(PeriodicoSimplesDTO::new)
                    .collect(Collectors.toList());

    PeriodicoDuplicadoResponse response =
            new PeriodicoDuplicadoResponse(ex.getMessage(), periodicoSimples);

    return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
  }

  @ExceptionHandler(VeiculoVinculadoException.class)
  public ResponseEntity<VeiculoVinculadoResponse> handleUsuarioVinculado(
          VeiculoVinculadoException ex
  ){
    VeiculoPublicacaoDTO veiculoPublicacaoDTO =
            new VeiculoPublicacaoDTO(ex.getVeiculoPublicacaoVinculado());
    VeiculoVinculadoResponse veiculoVinculadoResponse =
            new VeiculoVinculadoResponse(ex.getMessage(), veiculoPublicacaoDTO);

    return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(veiculoVinculadoResponse);
  }

  @ExceptionHandler(PesquisadorUnauthorizedException.class)
  public ResponseEntity<PesquisadorUnauthorizedResponse> handleUsuarioVinculado(
          PesquisadorUnauthorizedException ex
  ){
    VeiculoPublicacaoDTO veiculoPublicacaoDTO =
            new VeiculoPublicacaoDTO(ex.getPesquisadorUnauthorized());
    PesquisadorUnauthorizedResponse pesquisadorUnauthorizedResponse =
            new PesquisadorUnauthorizedResponse(ex.getMessage(), veiculoPublicacaoDTO);

    return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(pesquisadorUnauthorizedResponse);
  }

}
