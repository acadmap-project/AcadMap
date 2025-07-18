package com.acadmap.model.dto.evento;

import com.acadmap.model.entities.Evento;
import com.acadmap.model.enums.ClassificacaoVeiculo;
import com.acadmap.model.enums.TipoVeiculo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventoResumoListaDTO {

    private UUID idVeiculo;
    private String nome;
    private TipoVeiculo tipo;
    private ClassificacaoVeiculo classificacao;

    public EventoResumoListaDTO(Evento evento) {
        this.idVeiculo = evento.getIdVeiculo();
        this.nome = evento.getNome();
        this.tipo = evento.getTipo();
        this.classificacao = evento.getClassificacao();
    }
}