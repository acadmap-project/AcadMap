package com.acadmap.model.dto.evento;

import com.acadmap.model.entities.AreaPesquisa;
import com.acadmap.model.entities.Evento;
import com.acadmap.model.enums.AdequacaoDefesa;
import com.acadmap.model.enums.ClassificacaoVeiculo;
import com.acadmap.model.enums.TipoVeiculo;
import com.acadmap.model.enums.VinculoSBC;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventoResumoListaDTO {

    private UUID idVeiculo;
    private String nome;
    private ClassificacaoVeiculo classificacao;
    private Integer h5;
    private AdequacaoDefesa adequacaoDefesa;
    private VinculoSBC vinculoSBC;
    private Set<String> areaPesquisa;

    public EventoResumoListaDTO(Evento evento) {
        this.idVeiculo = evento.getIdVeiculo();
        this.nome = evento.getNome();
        this.classificacao = evento.getClassificacao();
        this.h5 = evento.getH5();
        this.adequacaoDefesa = evento.getAdequadoDefesa();
        this.classificacao = evento.getClassificacao();
        this.vinculoSBC = evento.getVinculoSbc();
        this.areaPesquisa = evento.getAreasPesquisa().stream().map(AreaPesquisa::getNome).collect(Collectors.toSet());
    }
}