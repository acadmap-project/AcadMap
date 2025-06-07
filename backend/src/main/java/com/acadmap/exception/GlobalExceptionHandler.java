package com.acadmap.exception;

import com.acadmap.model.dto.EventoSimplesDTO;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;
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
}
