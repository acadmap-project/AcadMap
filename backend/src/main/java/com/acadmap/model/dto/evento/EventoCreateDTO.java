package com.acadmap.model.dto.evento;

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

  private Integer h5;

  private String linkGoogleScholar;

  private ClassificacaoVeiculo classificacao;

  private VinculoSBC vinculoSbc;

  private AdequacaoDefesa adequadoDefesa;

  private TipoVeiculo tipo;

  private StatusVeiculo status;

  private Set<UUID> areasPesquisaIds;

  private String linkSolSbc;
}
