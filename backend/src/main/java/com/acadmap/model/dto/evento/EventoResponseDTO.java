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
        Integer h5,
        String linkGoogleScholar,
        ClassificacaoVeiculo classificacao,
        VinculoSBC vinculoSbc,
        AdequacaoDefesa adequadoDefesa,
        TipoVeiculo tipo,
        StatusVeiculo status,
        String linkSolSbc,
        Set<UUID> areasPesquisaIds,
        UsuarioResumoDTO usuario
) {
    public EventoResponseDTO(Evento evento) {
        this(
                evento.getIdVeiculo(),
                evento.getNome(),
                evento.getH5(),
                evento.getLinkGoogleScholar(),
                evento.getClassificacao(),
                evento.getVinculoSbc(),
                evento.getAdequadoDefesa(),
                evento.getTipo(),
                evento.getStatus(),
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