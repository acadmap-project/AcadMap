package com.acadmap.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum AdequacaoDefesa {


    mestrado("mestrado"),
    doutorado("doutorado"),
    nenhum("nenhum"),
    mestrado_doutorado("mestrado_doutorado");


    private String codigo;

    private AdequacaoDefesa(String codigo){
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }



    @JsonCreator
    public static AdequacaoDefesa doValor(String codigo){
        for(AdequacaoDefesa adequacaoDefesa : AdequacaoDefesa.values()){
            if(adequacaoDefesa.getCodigo().equals(codigo.toLowerCase())){
                return adequacaoDefesa;
            }
        }
        throw new IllegalArgumentException("Ta errado o enum paizão");
    }
}
