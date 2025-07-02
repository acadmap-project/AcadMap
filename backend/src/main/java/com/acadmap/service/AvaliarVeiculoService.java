package com.acadmap.service;


import com.acadmap.model.dto.periodico.ClassificacaoPeriodicoRequestDTO;
import com.acadmap.model.dto.veiculo.VeiculoPublicacaoDTO;
import com.acadmap.model.entities.VeiculoPublicacao;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.model.enums.TipoVeiculo;
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
    private ClassificarPeriodicoService classificarPeriodicoService;


    public VeiculoPublicacaoDTO aceito(UUID veiculoUuid, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO, UUID idUser){
        return VeiculoPublicacaoDTO.buildVeiculoDto(avaliarPublicacao(veiculoUuid, StatusVeiculo.aceito, classificacaoPeriodicoRequestDTO, idUser));
    }


    public VeiculoPublicacaoDTO negar(UUID veiculoUuid, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO, UUID idUser){
        return VeiculoPublicacaoDTO.buildVeiculoDto(avaliarPublicacao(veiculoUuid, StatusVeiculo.negado, classificacaoPeriodicoRequestDTO, idUser));
    }

    public VeiculoPublicacao avaliarPublicacao(UUID veiculoUuid, StatusVeiculo statusVeiculo, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO, UUID idUser){

        VeiculoPublicacao veiculoPublicacaoAtual = veiculoPublicacaoRepository.findById(veiculoUuid).orElseThrow();

        if (veiculoPublicacaoAtual.getTipo() == TipoVeiculo.periodico){
            classificarPeriodicoService.classificarPeriodico(veiculoUuid, classificacaoPeriodicoRequestDTO, idUser);
        }

        veiculoPublicacaoAtual.setStatus(statusVeiculo);
        veiculoPublicacaoRepository.save(veiculoPublicacaoAtual);

        return veiculoPublicacaoAtual;
    }

}
