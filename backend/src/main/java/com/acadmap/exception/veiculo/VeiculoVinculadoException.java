package com.acadmap.exception.veiculo;

import com.acadmap.model.entities.VeiculoPublicacao;
import lombok.Getter;

@Getter
public class VeiculoVinculadoException extends RuntimeException {
    private final VeiculoPublicacao veiculoPublicacao;

    public VeiculoVinculadoException(String message, VeiculoPublicacao veiculoPublicacao) {
        super(message);
        this.veiculoPublicacao = veiculoPublicacao;
    }



}
