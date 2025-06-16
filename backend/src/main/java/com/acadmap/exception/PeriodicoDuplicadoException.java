package com.acadmap.exception;

import com.acadmap.model.entities.Periodico;

import java.util.List;

public class PeriodicoDuplicadoException extends RuntimeException {
    private final List<Periodico> periodicosSimilares;

    public PeriodicoDuplicadoException(String message, List<Periodico> periodicosSimilares) {
        super(message);
        this.periodicosSimilares = periodicosSimilares;
    }

    public List<Periodico> getPeriodicosSimilares (){return this.periodicosSimilares;}
}
