package com.acadmap.service;


import com.acadmap.exception.veiculo.VeiculoVinculadoException;
import com.acadmap.model.dto.periodico.ClassificacaoPeriodicoRequestDTO;
import com.acadmap.model.dto.veiculo.VeiculoPublicacaoDTO;
import com.acadmap.model.entities.JustificativaRecusa;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.entities.VeiculoPublicacao;
import com.acadmap.model.enums.AcaoLog;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.model.enums.TipoVeiculo;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.repository.VeiculoPublicacaoRepository;
import java.util.UUID;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Transactional
public class AvaliarVeiculoService {

    private VeiculoPublicacaoRepository veiculoPublicacaoRepository;
    private RegistrarLogService registrarLogService;
    private ClassificarPeriodicoService classificarPeriodicoService;
    private UsuarioRepository usuarioRepository;


    public VeiculoPublicacaoDTO aceito(UUID veiculoUuid, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO, UUID idUser){

        VeiculoPublicacao veiculoPublicacaoAvaliado = avaliarPublicacao(veiculoUuid, StatusVeiculo.aceito, classificacaoPeriodicoRequestDTO, idUser);
        registrarLog(veiculoPublicacaoAvaliado.getStatus(), classificacaoPeriodicoRequestDTO, veiculoPublicacaoAvaliado, idUser);
        return VeiculoPublicacaoDTO.buildVeiculoDto(veiculoPublicacaoAvaliado);

    }


    public VeiculoPublicacaoDTO negar(UUID veiculoUuid, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO, UUID idUser){

        validarJustificativa(veiculoUuid, classificacaoPeriodicoRequestDTO);
        VeiculoPublicacao veiculoPublicacaoAvaliado = avaliarPublicacao(veiculoUuid, StatusVeiculo.negado, classificacaoPeriodicoRequestDTO, idUser);
        registrarLog(veiculoPublicacaoAvaliado.getStatus(), classificacaoPeriodicoRequestDTO, veiculoPublicacaoAvaliado, idUser);
        return VeiculoPublicacaoDTO.buildVeiculoDto(veiculoPublicacaoAvaliado);

    }


    public VeiculoPublicacao avaliarPublicacao(UUID veiculoUuid, StatusVeiculo statusVeiculo, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO, UUID idUser){

        VeiculoPublicacao veiculoPublicacaoAtual = veiculoPublicacaoRepository.findById(veiculoUuid).orElseThrow();
        veiculoPublicacaoAtual.setStatus(statusVeiculo);
        if (veiculoPublicacaoAtual.getTipo() == TipoVeiculo.periodico){
            classificarPeriodicoService.classificarPeriodico(veiculoUuid, classificacaoPeriodicoRequestDTO, idUser);
        }
        veiculoPublicacaoRepository.save(veiculoPublicacaoAtual);
        return veiculoPublicacaoAtual;

    }

    private void validarJustificativa(UUID veiculoUuid, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO) {
        if (classificacaoPeriodicoRequestDTO.getJustificativa() == null){
            throw new VeiculoVinculadoException(
                    "Não foi apresentada a justificativa de negação do veiculo",
                    veiculoPublicacaoRepository.findById(veiculoUuid).orElseThrow(EntityNotFoundException::new)
            );
        }
    }

    private void registrarLog(StatusVeiculo statusVeiculo, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO, VeiculoPublicacao veiculoPublicacaoAtual, UUID idUser) {

        Usuario usuario = usuarioRepository.findById(idUser).orElseThrow();
        if (statusVeiculo.getCodigo().contains(StatusVeiculo.negado.getCodigo())){
            JustificativaRecusa justificativaRecusa = new JustificativaRecusa();
            justificativaRecusa.setJustificativa(classificacaoPeriodicoRequestDTO.getJustificativa());
            registrarLogService.registrarNegarVeiculo(veiculoPublicacaoAtual, usuario, justificativaRecusa);
        } else {
            registrarLogService.gerarLogVeiculo(veiculoPublicacaoAtual, usuario, AcaoLog.cadastro_veiculo_aceito);
        }

    }

}
