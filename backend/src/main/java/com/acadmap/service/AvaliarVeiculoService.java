package com.acadmap.service;


import com.acadmap.model.dto.veiculo.VeiculoPublicacaoDTO;
import com.acadmap.model.entities.VeiculoPublicacao;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.repository.VeiculoPublicacaoRepository;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Transactional
public class AvaliarVeiculoService {

    private VeiculoPublicacaoRepository veiculoPublicacaoRepository;


    public VeiculoPublicacaoDTO aceito(UUID veiculoUuid){
        return VeiculoPublicacaoDTO.buildVeiculoDto(avaliarPublicacao(veiculoUuid, StatusVeiculo.aceito));
    }


    public VeiculoPublicacaoDTO negar(UUID veiculoUuid){
        return VeiculoPublicacaoDTO.buildVeiculoDto(avaliarPublicacao(veiculoUuid, StatusVeiculo.negado));
    }

    public VeiculoPublicacao avaliarPublicacao(UUID veiculoUuid, StatusVeiculo statusVeiculo){

        VeiculoPublicacao veiculoPublicacaoAtual = veiculoPublicacaoRepository.findById(veiculoUuid).orElseThrow();
        veiculoPublicacaoAtual.setStatus(statusVeiculo);
        veiculoPublicacaoRepository.save(veiculoPublicacaoAtual);

        return veiculoPublicacaoAtual;
    }

}
