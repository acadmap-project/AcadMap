package com.acadmap.model.dto;

import com.acadmap.model.Evento;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EventoSimplesDTO {
  private UUID idVeiculo;
  private String nome;
  private String classificacao;
  private String linkEvento;

  public EventoSimplesDTO(Evento evento) {
    this.idVeiculo = evento.getIdVeiculo();
    this.nome = evento.getNome();
    this.classificacao = String.valueOf(evento.getClassificacao());
    this.linkEvento = evento.getLinkEvento();
  }

}
