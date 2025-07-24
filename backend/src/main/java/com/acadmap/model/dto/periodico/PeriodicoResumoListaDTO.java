package com.acadmap.model.dto.periodico;

import com.acadmap.model.entities.AreaPesquisa;
import com.acadmap.model.entities.Periodico;
import com.acadmap.model.enums.AdequacaoDefesa;
import com.acadmap.model.enums.ClassificacaoVeiculo;
import com.acadmap.model.enums.TipoVeiculo;
import com.acadmap.model.enums.VinculoSBC;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PeriodicoResumoListaDTO {

    private UUID idVeiculo;
    private String nome;
    private ClassificacaoVeiculo classificacao;
    private Boolean flagPredatorio;
    private Integer h5;
    private AdequacaoDefesa adequacaoDefesa;
    private VinculoSBC vinculoSBC;
    private Set<String> areaPesquisa;


    public PeriodicoResumoListaDTO(Periodico periodico) {
        this.idVeiculo = periodico.getIdVeiculo();
        this.nome = periodico.getNome();
        this.classificacao = periodico.getClassificacao();
        this.flagPredatorio = periodico.getFlagPredatorio();
        this.h5 = periodico.getH5();
        this.adequacaoDefesa = periodico.getAdequadoDefesa();
        this.classificacao = periodico.getClassificacao();
        this.vinculoSBC = periodico.getVinculoSbc();
        this.areaPesquisa = periodico.getAreasPesquisa().stream().map(AreaPesquisa::getNome).collect(Collectors.toSet());
    }
}