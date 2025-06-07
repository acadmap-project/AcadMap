package com.acadmap.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TipoPerfilUsuario {

    administrador("administrador"),
    auditor("auditor"),
    pesquisador("pesquisador");


    private String codigo;

    private TipoPerfilUsuario(String codigo){
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }



    @JsonCreator
    public static TipoPerfilUsuario doValor(String codigo){
        for(TipoPerfilUsuario tipoPerfilUsuario : TipoPerfilUsuario.values()){
            if(tipoPerfilUsuario.getCodigo().equals(codigo.toUpperCase())){
                return tipoPerfilUsuario;
            }
        }
        throw new IllegalArgumentException("Ta errado o enum paizão");
    }
}
