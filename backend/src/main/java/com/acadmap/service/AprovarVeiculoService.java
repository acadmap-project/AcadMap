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


    public VeiculoPublicacao aprovar(UUID uuid){

        VeiculoPublicacao veiculoPublicacaoAtual = veiculoPublicacaoRepository.findById(uuid).orElseThrow();
        veiculoPublicacaoAtual.setStatus(StatusVeiculo.aceito);
        veiculoPublicacaoRepository.save(veiculoPublicacaoAtual);

        return veiculoPublicacaoAtual;
    }


    public VeiculoPublicacao negar(UUID uuid){

        VeiculoPublicacao veiculoPublicacaoAtual = veiculoPublicacaoRepository.findById(uuid).orElseThrow();
        veiculoPublicacaoAtual.setStatus(StatusVeiculo.negado);
        veiculoPublicacaoRepository.save(veiculoPublicacaoAtual);

        return veiculoPublicacaoAtual;
    }
}
