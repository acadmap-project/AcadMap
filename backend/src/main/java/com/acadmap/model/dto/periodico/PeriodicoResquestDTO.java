package com.acadmap.model.dto.periodico;

import com.acadmap.model.enums.*;

import java.util.Set;
import java.util.UUID;

public record PeriodicoResquestDTO(String nome,
                                   ClassificacaoVeiculo classificacao,
                                   VinculoSBC vinculoSBC,
                                   AdequacaoDefesa adequadoDefesa,
                                   TipoVeiculo tipo,
                                   StatusVeiculo status,
                                   Set<UUID> areasPesquisaIds,
                                   String issn,
                                   Integer percentil,
                                   String linkJcr,
                                   String linkScopus,
                                   String linkGoogleScholar,
                                   QualisAntigo qualisAntigo
                                   ) {

}
