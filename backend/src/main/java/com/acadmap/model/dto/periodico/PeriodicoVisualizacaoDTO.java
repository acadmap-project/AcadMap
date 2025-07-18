package com.acadmap.model.dto.periodico;

import com.acadmap.model.entities.AreaPesquisa;
import com.acadmap.model.entities.Periodico;
import com.acadmap.model.enums.AdequacaoDefesa;
import com.acadmap.model.enums.ClassificacaoVeiculo;
import com.acadmap.model.enums.QualisAntigo;
import com.acadmap.model.enums.VinculoSBC;
import java.util.Set;
import java.util.stream.Collectors;

public record PeriodicoVisualizacaoDTO(String nome, String issn, Double percentilJcr,
    Double percentilScopus, Set<String> areasPesquisas, VinculoSBC vinculoSbc, String linkJcr,
    String linkScopus, String linkGoogleScholar, QualisAntigo qualisAntigo,
    ClassificacaoVeiculo classificacao, Boolean flagPredatorio, AdequacaoDefesa adequacaoDefesa) {
  public PeriodicoVisualizacaoDTO(Periodico periodico) {
    this(periodico.getNome(), periodico.getIssn(), periodico.getPercentilJcr(),
        periodico.getPercentilScopus(),
        periodico.getAreasPesquisa().stream().map(AreaPesquisa::getNome)
            .collect(Collectors.toSet()),
        periodico.getVinculoSbc(), periodico.getLinkJcr(), periodico.getLinkScopus(),
        periodico.getLinkGoogleScholar(), periodico.getQualisAntigo(), periodico.getClassificacao(),
        periodico.getFlagPredatorio(), periodico.getAdequadoDefesa());
  }
}
