package com.acadmap.exception.evento;


import com.acadmap.model.entities.Evento;
import lombok.Getter;

import java.util.List;


@Getter
public class EventoDuplicadoException extends RuntimeException {
  private final List<Evento> eventosSimilares;

  public EventoDuplicadoException(String message, List<Evento> eventosSimilares) {
    super(message);
    this.eventosSimilares = eventosSimilares;
  }

}
