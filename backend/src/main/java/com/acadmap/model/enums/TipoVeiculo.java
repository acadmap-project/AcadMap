package com.acadmap.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TipoVeiculo {

    evento("evento"),
    periodico("periodico");


    private String codigo;

    private TipoVeiculo(String codigo){
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }



    @JsonCreator
    public static TipoVeiculo doValor(String codigo){
        for(TipoVeiculo tipoVeiculo : TipoVeiculo.values()){
            if(tipoVeiculo.getCodigo().equals(codigo.toUpperCase())){
                return tipoVeiculo;
            }
        }
        throw new IllegalArgumentException("Ta errado o enum paizão");
    }
}
