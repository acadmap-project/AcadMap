package com.acadmap.model.DTO;

import com.acadmap.model.Evento;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

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
