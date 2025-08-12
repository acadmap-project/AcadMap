package com.acadmap.model.dto.veiculo;

import com.acadmap.model.enums.AdequacaoDefesa;
import com.acadmap.model.enums.ClassificacaoVeiculo;
import com.acadmap.model.enums.VinculoSBC;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class FiltroVeiculoRequestDTO {

    private String nome;

    private Set<UUID> areasPesquisaIds;

    private Set<String> areasPesquisaNomes;

    private Boolean vinculoSbc;

    private Set<AdequacaoDefesa> adequacaoDefesa;

    private Integer h5Minimo;

    private ClassificacaoVeiculo classificacaoMinima;

    //AND (true) ou OR (false)
    private boolean correspondenciaExata = false;
}