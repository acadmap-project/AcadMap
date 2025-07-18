package com.acadmap.model.dto.periodico;

import com.acadmap.model.entities.Periodico;
import com.acadmap.model.enums.ClassificacaoVeiculo;
import com.acadmap.model.enums.TipoVeiculo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PeriodicoResumoListaDTO {

    private UUID idVeiculo;
    private String nome;
    private TipoVeiculo tipo;
    private ClassificacaoVeiculo classificacao;
    private Boolean flagPredatorio;

    public PeriodicoResumoListaDTO(Periodico periodico) {
        this.idVeiculo = periodico.getIdVeiculo();
        this.nome = periodico.getNome();
        this.tipo = periodico.getTipo();
        this.classificacao = periodico.getClassificacao();
        this.flagPredatorio = periodico.getFlagPredatorio();
    }
}