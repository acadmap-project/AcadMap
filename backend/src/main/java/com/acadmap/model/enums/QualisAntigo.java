package com.acadmap.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum QualisAntigo {

    a1("a1"),
    a2("a2"),
    a3("a3"),
    a4("a4"),
    b1("b1"),
    b2("b2"),
    b3("b3"),
    b4("b4");

    private String codigo;

    private QualisAntigo(String codigo){
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }



    @JsonCreator
    public static QualisAntigo doValor(String codigo){
        for(QualisAntigo qualisAntigo : QualisAntigo.values()){
            if(qualisAntigo.getCodigo().equals(codigo.toLowerCase())){
                return qualisAntigo;
            }
        }
        throw new IllegalArgumentException("Ta errado o enum paizão");
    }
}
