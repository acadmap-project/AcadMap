package com.acadmap.model.dto.evento;

import com.acadmap.model.entities.AreaPesquisa;
import com.acadmap.model.entities.Evento;
import com.acadmap.model.enums.AdequacaoDefesa;
import com.acadmap.model.enums.ClassificacaoVeiculo;
import com.acadmap.model.enums.VinculoSBC;
import java.util.Set;
import java.util.stream.Collectors;

public record EventoVisualizacaoDTO(String nome, Integer h5, ClassificacaoVeiculo classificacao,
    Set<String> areasPesquisas, VinculoSBC vinculoSbc, String linkGoogleScholar, String linkSolSbc,
    AdequacaoDefesa adequacaoDefesa)

{
  public EventoVisualizacaoDTO(Evento evento) {
    this(evento.getNome(), evento.getH5(), evento.getClassificacao(),
        evento.getAreasPesquisa().stream().map(AreaPesquisa::getNome).collect(Collectors.toSet()),
        evento.getVinculoSbc(), evento.getLinkGoogleScholar(), evento.getLinkSolSbc(),
        evento.getAdequadoDefesa());
  }
}
