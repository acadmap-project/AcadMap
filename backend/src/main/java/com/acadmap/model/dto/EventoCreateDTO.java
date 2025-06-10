package com.acadmap.model.dto;

import com.acadmap.model.entities.LogVeiculo;
import com.acadmap.model.enums.*;
import lombok.*;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventoCreateDTO {

  private String nome;

  private ClassificacaoVeiculo classificacao;

  private VinculoSBC vinculoSbc;

  private AdequacaoDefesa adequadoDefesa;

  private TipoVeiculo tipo;

  private StatusVeiculo status;

  private Set<UUID> areasPesquisaIds;

  private Set<LogVeiculo> log ;

  private Integer h5;

  private String linkEvento;

  private String linkGoogleScholar;

  private String linkSolSbc;
}
