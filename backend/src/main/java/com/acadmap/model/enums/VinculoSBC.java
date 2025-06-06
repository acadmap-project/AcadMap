package com.acadmap.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum VinculoSBC {


    sem_vinculo("sem_vinculo"),
    vinculo_top_10("vinculo_top_10"),
    vinculo_top_20("vinculo_top_20"),
    vinculo_comum("vinculo_comun");


    private String codigo;

    private VinculoSBC(String codigo){
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }



    @JsonCreator
    public static VinculoSBC doValor(String codigo){
        for(VinculoSBC vinculoSBC : VinculoSBC.values()){
            if(vinculoSBC.getCodigo().equals(codigo.toUpperCase())){
                return vinculoSBC;
            }
        }
        throw new IllegalArgumentException("Ta errado o enum paizão");
    }
}
