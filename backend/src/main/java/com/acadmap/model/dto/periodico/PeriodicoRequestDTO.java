package com.acadmap.model.dto.periodico;

import com.acadmap.model.enums.*;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.util.Set;
import java.util.UUID;

public record PeriodicoRequestDTO(String nome,
                                  Integer h5,
                                  String linkGoogleScholar,
                                  ClassificacaoVeiculo classificacao,
                                  VinculoSBC vinculoSbc,
                                  AdequacaoDefesa adequadoDefesa,
                                  TipoVeiculo tipo,
                                  StatusVeiculo status,
                                  Set<UUID> areasPesquisaIds,
                                  String issn,
                                  Integer percentilJcr,
                                  Integer percentilScopus,
                                  String linkJcr,
                                  String linkScopus,
                                  QualisAntigo qualisAntigo
                                   ) {

}
