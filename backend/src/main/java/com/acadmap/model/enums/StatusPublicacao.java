package com.acadmap.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum StatusPublicacao {

    PENDENTE("PENDENTE"),
    APROVADO("APROVADO"),
    NEGADO("NEGADO");


    private String codigo;

    private StatusPublicacao(String codigo){
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }



    @JsonCreator
    public static StatusPublicacao doValor(String codigo){
        for(StatusPublicacao estabelecimento : StatusPublicacao.values()){
            if(estabelecimento.getCodigo().equals(codigo.toUpperCase())){
                return estabelecimento;
            }
        }
        throw new IllegalArgumentException("Ta errado o enum paizão");
    }
}
