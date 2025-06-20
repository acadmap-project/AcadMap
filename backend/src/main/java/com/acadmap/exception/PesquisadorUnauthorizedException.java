package com.acadmap.exception;

import com.acadmap.model.entities.VeiculoPublicacao;

public class PesquisadorUnauthorizedException extends RuntimeException {
    private final VeiculoPublicacao veiculoPublicacao;

    public PesquisadorUnauthorizedException(String message, VeiculoPublicacao veiculoPublicacao) {
        super(message);
        this.veiculoPublicacao = veiculoPublicacao;
    }

    public VeiculoPublicacao getPesquisadorUnauthorized(){
        return this.veiculoPublicacao;
    }
}
