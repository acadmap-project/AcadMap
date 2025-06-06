package com.acadmap.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum StatusVeiculo {

    pendente("pendente"),
    aceito("aceito"),
    excluido("excluido"),
    negado("negado");

    private String codigo;

    private StatusVeiculo(String codigo){
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }



    @JsonCreator
    public static StatusVeiculo doValor(String codigo){
        for(StatusVeiculo statusVeiculo : StatusVeiculo.values()){
            if(statusVeiculo.getCodigo().equals(codigo.toLowerCase())){
                return statusVeiculo;
            }
        }
        throw new IllegalArgumentException("Ta errado o enum paizão");
    }
}
