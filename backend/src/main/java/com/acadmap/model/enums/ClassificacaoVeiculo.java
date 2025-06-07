package com.acadmap.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum ClassificacaoVeiculo {

    a1("a1"),
    a2("a2"),
    a3("a3"),
    a4("a4"),
    a5("a5"),
    a6("a6"),
    a7("a7"),
    a8("a8");

    private String codigo;

    private ClassificacaoVeiculo(String codigo){
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }



    @JsonCreator
    public static ClassificacaoVeiculo doValor(String codigo){
        for(ClassificacaoVeiculo classificacaoVeiculo : ClassificacaoVeiculo.values()){
            if(classificacaoVeiculo.getCodigo().equals(codigo.toLowerCase())){
                return classificacaoVeiculo;
            }
        }
        throw new IllegalArgumentException("Ta errado o enum paizão");
    }
}
