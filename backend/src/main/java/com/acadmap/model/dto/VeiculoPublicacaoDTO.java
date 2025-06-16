package com.acadmap.model.dto;

import com.acadmap.model.entities.Evento;
import com.acadmap.model.entities.VeiculoPublicacao;
import com.acadmap.model.enums.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;


@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class VeiculoPublicacaoDTO {
    private UUID idVeiculo;
    private String nome;
    private ClassificacaoVeiculo classificacao;
    private VinculoSBC vinculoSbc;
    private AdequacaoDefesa adequadoDefesa;
    private TipoVeiculo tipo;
    private StatusVeiculo status;
    private UsuarioResponseDTO usuario;
    private Set<AreaPesquisaDTO> areasPesquisa;
    private String linkEvento;

    public VeiculoPublicacaoDTO(VeiculoPublicacao veiculo) {
        this.setIdVeiculo(veiculo.getIdVeiculo());
        this.setNome(veiculo.getNome());
        this.setClassificacao(veiculo.getClassificacao());
        this.setVinculoSbc(veiculo.getVinculoSbc());
        this.setAdequadoDefesa(veiculo.getAdequadoDefesa());
        this.setTipo(veiculo.getTipo());
        this.setStatus(veiculo.getStatus());
        this.usuario = new UsuarioResponseDTO(veiculo.getUsuario());
        this.setAreasPesquisa(veiculo.getAreasPesquisa().stream()
                .map(AreaPesquisaDTO::new)
                .collect(Collectors.toSet()));
        this.setLinkEvento(veiculo.getLinkEvento());
    }

    public static VeiculoPublicacaoDTO buildVeiculoDto(VeiculoPublicacao veiculo){
        return new VeiculoPublicacaoDTO(veiculo);
    }

}

