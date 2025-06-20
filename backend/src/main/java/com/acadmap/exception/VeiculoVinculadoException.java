package com.acadmap.exception;

import com.acadmap.model.entities.VeiculoPublicacao;

public class VeiculoVinculadoException extends RuntimeException {
    private final VeiculoPublicacao veiculoPublicacao;

    public VeiculoVinculadoException(String message, VeiculoPublicacao veiculoPublicacao) {
        super(message);
        this.veiculoPublicacao = veiculoPublicacao;
    }

    public VeiculoPublicacao getVeiculoPublicacaoVinculado(){
        return this.veiculoPublicacao;
    }


}
