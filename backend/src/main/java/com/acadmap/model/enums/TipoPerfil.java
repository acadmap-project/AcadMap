package com.acadmap.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TipoPerfil {

    ADMINISTRADOR("ADMINISTRADOR"),
    AUDITOR("AUDITOR"),
    PESQUISADOR("PESQUISADOR");


    private String codigo;

    private TipoPerfil(String codigo){
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }



    @JsonCreator
    public static TipoPerfil doValor(String codigo){
        for(TipoPerfil estabelecimento : TipoPerfil.values()){
            if(estabelecimento.getCodigo().equals(codigo.toUpperCase())){
                return estabelecimento;
            }
        }
        throw new IllegalArgumentException("Ta errado o enum paizão");
    }
}
