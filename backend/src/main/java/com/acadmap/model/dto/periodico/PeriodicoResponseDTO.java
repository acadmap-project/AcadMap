package com.acadmap.model.dto.periodico;

import com.acadmap.model.entities.AreaPesquisa;
import com.acadmap.model.entities.Periodico;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.*;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record PeriodicoResponseDTO(UUID idVeiculo,
                                   String nome,
                                   ClassificacaoVeiculo classificacao,
                                   VinculoSBC vinculoSBC,
                                   AdequacaoDefesa adequadoDefesa,
                                   TipoVeiculo tipo,
                                   StatusVeiculo status,
                                   String issn,
                                   Integer percentil_jcr,
                                   Integer percentil_scopus,
                                   String linkJcr,
                                   String linkScopus,
                                   String linkGoogleScholar,
                                   QualisAntigo qualisAntigo,
                                   Set<UUID> areasPesquisaIds,
                                   UsuarioResumoDTO usuario,
                                   Boolean flagPredatorio) {

    public PeriodicoResponseDTO(Periodico periodico){
        this(
                periodico.getIdVeiculo(),
                periodico.getNome(),
                periodico.getClassificacao(),
                periodico.getVinculoSbc(),
                periodico.getAdequadoDefesa(),
                periodico.getTipo(),
                periodico.getStatus(),
                periodico.getIssn(),
                periodico.getPercentilJcr(),
                periodico.getPercentilScopus(),
                periodico.getLinkJcr(),
                periodico.getLinkScopus(),
                periodico.getLinkGoogleScholar(),
                periodico.getQualisAntigo(),
                periodico.getAreasPesquisa().stream()
                        .map(AreaPesquisa::getIdAreaPesquisa)
                        .collect(Collectors.toSet()),
                new UsuarioResumoDTO(periodico.getUsuario()),
                periodico.getFlagPredatorio()
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
