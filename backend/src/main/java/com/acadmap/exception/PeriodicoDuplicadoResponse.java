package com.acadmap.exception;

import com.acadmap.model.dto.PeriodicoSimplesDTO;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class PeriodicoDuplicadoResponse {

    private String message;
    private List<PeriodicoSimplesDTO> periodicosSimilares;
    private LocalDateTime timestamp;

    // Construtor vazio para Jackson
    public PeriodicoDuplicadoResponse(String s, List<PeriodicoSimplesDTO> similares, LocalDateTime now) {}

    public PeriodicoDuplicadoResponse(String message, List<PeriodicoSimplesDTO> periodicosSimilares) {
        this.message = message;
        this.periodicosSimilares = periodicosSimilares;
        this.timestamp = LocalDateTime.now(); // seta timestamp no momento da criação
    }

    public <R> PeriodicoDuplicadoResponse(String message, R periodicossimples) {}

    public String getMessage() {
        return this.message;
    }

    public List<PeriodicoSimplesDTO> getPeriodicosSimilares() {return this.periodicosSimilares;
    }

    public LocalDateTime getTimestamp() {
        return this.timestamp;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setPeriodicosSimilares(List<PeriodicoSimplesDTO> periodicosSimilares) {
        this.periodicosSimilares = periodicosSimilares;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

}
