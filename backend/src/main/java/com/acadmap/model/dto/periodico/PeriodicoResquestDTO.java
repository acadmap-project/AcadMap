package com.acadmap.model.dto.periodico;

import com.acadmap.model.enums.*;

import java.util.Set;
import java.util.UUID;

public record PeriodicoResquestDTO(String nome,
                                   Integer h5,
                                   String linkGoogleScholar,
                                   ClassificacaoVeiculo classificacao,
                                   VinculoSBC vinculoSBC,
                                   AdequacaoDefesa adequadoDefesa,
                                   TipoVeiculo tipo,
                                   StatusVeiculo status,
                                   Set<UUID> areasPesquisaIds,
                                   String issn,
                                   Integer percentilJcr,
                                   Integer percentilJcopus,
                                   String linkJcr,
                                   String linkScopus,
                                   QualisAntigo qualisAntigo
                                   ) {

}
