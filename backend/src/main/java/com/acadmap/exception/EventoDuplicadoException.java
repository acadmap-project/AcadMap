package com.acadmap.exception;


import com.acadmap.model.entities.Evento;
import java.util.List;

public class EventoDuplicadoException extends RuntimeException {
  private final List<Evento> eventosSimilares;

  public EventoDuplicadoException(String message, List<Evento> eventosSimilares) {
    super(message);
    this.eventosSimilares = eventosSimilares;
  }

  public List<Evento> getEventosSimilares() {
    return this.eventosSimilares;
  }
}
