package com.acadmap.exception;

import com.acadmap.model.DTO.EventoSimplesDTO;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class EventoDuplicadoResponse {

    private String message;
    private List<EventoSimplesDTO> eventosSimilares;
    private LocalDateTime timestamp;
    // Construtor vazio para Jackson
    public EventoDuplicadoResponse(String s, List<EventoSimplesDTO> similares, LocalDateTime now) {}

    public EventoDuplicadoResponse(String message, List<EventoSimplesDTO> eventosSimilares) {
        this.message = message;
        this.eventosSimilares = eventosSimilares;
        this.timestamp = LocalDateTime.now();  // seta timestamp no momento da criação
    }

    public <R> EventoDuplicadoResponse(String message, R eventosSimples) {
    }

    public String getMessage() {
        return message;
    }

    public List<EventoSimplesDTO> getEventosSimilares() {
        return eventosSimilares;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setEventosSimilares(List<EventoSimplesDTO> eventosSimilares) {
        this.eventosSimilares = eventosSimilares;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
