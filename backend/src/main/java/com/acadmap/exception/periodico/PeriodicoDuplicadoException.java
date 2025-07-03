package com.acadmap.exception.periodico;

import com.acadmap.model.entities.Periodico;
import lombok.Getter;

import java.util.List;


@Getter
public class PeriodicoDuplicadoException extends RuntimeException {

    private final List<Periodico> periodicosSimilares;

    public PeriodicoDuplicadoException(String message, List<Periodico> periodicosSimilares) {
        super(message);
        this.periodicosSimilares = periodicosSimilares;
    }

}
