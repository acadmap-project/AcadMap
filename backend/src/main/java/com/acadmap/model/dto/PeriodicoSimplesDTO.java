package com.acadmap.model.dto;

import com.acadmap.model.entities.Evento;
import com.acadmap.model.entities.Periodico;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
public class PeriodicoSimplesDTO {

    private UUID idVeiculo;
    private String nome;
    private String classificacao;

    public PeriodicoSimplesDTO(Periodico periodico) {
        this.idVeiculo = periodico.getIdVeiculo();
        this.nome = periodico.getNome();
        this.classificacao = String.valueOf(periodico.getClassificacao());
    }



}
