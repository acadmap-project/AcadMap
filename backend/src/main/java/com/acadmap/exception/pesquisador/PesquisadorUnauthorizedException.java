package com.acadmap.exception.pesquisador;

import com.acadmap.model.entities.VeiculoPublicacao;
import lombok.Getter;

@Getter
public class PesquisadorUnauthorizedException extends RuntimeException {
    private final VeiculoPublicacao veiculoPublicacao;

    public PesquisadorUnauthorizedException(String message, VeiculoPublicacao veiculoPublicacao) {
        super(message);
        this.veiculoPublicacao = veiculoPublicacao;
    }

}
