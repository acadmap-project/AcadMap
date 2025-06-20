package com.acadmap.exception;

import com.acadmap.model.dto.VeiculoPublicacaoDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@NoArgsConstructor
@Getter
@Setter
public class VeiculoVinculadoResponse {
    private String message;
    private VeiculoPublicacaoDTO veiculoPublicacaoDTO;
    private LocalDateTime timestamp;

    public VeiculoVinculadoResponse(String message, VeiculoPublicacaoDTO veiculoPublicacaoDTO){
        this.message = message;
        this.veiculoPublicacaoDTO = veiculoPublicacaoDTO;
        this.timestamp = LocalDateTime.now();
    }

    public <R> VeiculoVinculadoResponse(String message, R veiculoPublicacao){

    }


}
