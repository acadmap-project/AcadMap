package com.acadmap.model.dto.evento;

import com.acadmap.model.entities.AreaPesquisa;
import com.acadmap.model.entities.Evento;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.*;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record EventoResponseDTO(
        UUID idVeiculo,
        String nome,
        ClassificacaoVeiculo classificacao,
        VinculoSBC vinculoSbc,
        AdequacaoDefesa adequadoDefesa,
        TipoVeiculo tipo,
        StatusVeiculo status,
        Integer h5,
        String linkEvento,
        String linkGoogleScholar,
        String linkSolSbc,
        Set<UUID> areasPesquisaIds,
        UsuarioResumoDTO usuario
) {
    public EventoResponseDTO(Evento evento) {
        this(
                evento.getIdVeiculo(),
                evento.getNome(),
                evento.getClassificacao(),
                evento.getVinculoSbc(),
                evento.getAdequadoDefesa(),
                evento.getTipo(),
                evento.getStatus(),
                evento.getH5(),
                evento.getLinkEvento(),
                evento.getLinkGoogleScholar(),
                evento.getLinkSolSbc(),
                evento.getAreasPesquisa().stream()
                        .map(AreaPesquisa::getIdAreaPesquisa)
                        .collect(Collectors.toSet()),
                new UsuarioResumoDTO(evento.getUsuario())
        );
    }

    public record UsuarioResumoDTO(
            UUID idUsuario,
            String nome
    ) {
        public UsuarioResumoDTO(Usuario usuario) {
            this(
                    usuario.getIdUsuario(),
                    usuario.getNome()
            );
        }
    }
}