package com.acadmap.model.dto.periodico;

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
    private String linkGoogleScholar;
    private String linkJcr;
    private String linkScopus;

    public PeriodicoSimplesDTO(Periodico periodico) {
        this.idVeiculo = periodico.getIdVeiculo();
        this.nome = periodico.getNome();
        this.classificacao = String.valueOf(periodico.getClassificacao());
        this.linkGoogleScholar = periodico.getLinkGoogleScholar();
        this.linkJcr = periodico.getLinkJcr();
        this.linkScopus = periodico.getLinkScopus();
    }



}
