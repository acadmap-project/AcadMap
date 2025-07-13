package com.acadmap.model.dto.evento;

import com.acadmap.model.entities.Evento;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EventoSimplesDTO {
  private UUID idVeiculo;
  private String nome;
  private String classificacao;
  private String linkGoogleScholar;

  public EventoSimplesDTO(Evento evento) {
    this.idVeiculo = evento.getIdVeiculo();
    this.nome = evento.getNome();
    this.classificacao = String.valueOf(evento.getClassificacao());
    this.linkGoogleScholar = evento.getLinkGoogleScholar();
  }

}
