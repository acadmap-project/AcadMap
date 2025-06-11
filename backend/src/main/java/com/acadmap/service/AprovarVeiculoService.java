package com.acadmap.service;


import com.acadmap.model.entities.VeiculoPublicacao;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.repository.VeiculoPublicacaoRepository;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AprovarVeiculoService {

    private VeiculoPublicacaoRepository veiculoPublicacaoRepository;


    public VeiculoPublicacao aprovar(UUID veiculoUuid){
        return this.avaliarPublicacao(veiculoUuid, StatusVeiculo.aceito);
    }


    public VeiculoPublicacao negar(UUID veiculoUuid){
        return this.avaliarPublicacao(veiculoUuid, StatusVeiculo.negado);
    }

    public VeiculoPublicacao avaliarPublicacao(UUID veiculoUuid, StatusVeiculo statusVeiculo){

        VeiculoPublicacao veiculoPublicacaoAtual = veiculoPublicacaoRepository.findById(veiculoUuid).orElseThrow();
        veiculoPublicacaoAtual.setStatus(statusVeiculo);
        veiculoPublicacaoRepository.save(veiculoPublicacaoAtual);

        return veiculoPublicacaoAtual;
    }

}
