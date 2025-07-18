package com.acadmap.service;


import com.acadmap.exception.veiculo.VeiculoVinculadoException;
import com.acadmap.model.dto.periodico.ClassificacaoPeriodicoRequestDTO;
import com.acadmap.model.dto.veiculo.VeiculoPublicacaoDTO;
import com.acadmap.model.entities.JustificativaRecusa;
import com.acadmap.model.entities.Periodico;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.entities.VeiculoPublicacao;
import com.acadmap.model.enums.*;
import com.acadmap.repository.PeriodicoRepository;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.repository.VeiculoPublicacaoRepository;

import java.util.HashMap;
import java.util.Map;
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
    private ClassificarPeriodicoPredatorioService classificarPeriodicoPredatorioService;
    private UsuarioRepository usuarioRepository;
    private PeriodicoRepository periodicoRepository;


    public VeiculoPublicacaoDTO aceito(UUID veiculoUuid, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO, UUID idUser){
        VeiculoPublicacao veiculoPublicacaoAtual = veiculoPublicacaoRepository.findById(veiculoUuid).orElseThrow();
        classificarAdequacaoDefesa(veiculoPublicacaoAtual);
        avaliarPublicacao(veiculoPublicacaoAtual, StatusVeiculo.aceito, classificacaoPeriodicoRequestDTO, idUser);
        registrarLog(veiculoPublicacaoAtual.getStatus(), classificacaoPeriodicoRequestDTO, veiculoPublicacaoAtual, idUser);
        return VeiculoPublicacaoDTO.buildVeiculoDto(veiculoPublicacaoAtual);

    }


    public VeiculoPublicacaoDTO negar(UUID veiculoUuid, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO, UUID idUser){
        VeiculoPublicacao veiculoPublicacaoAtual = veiculoPublicacaoRepository.findById(veiculoUuid).orElseThrow();
        validarJustificativa(veiculoUuid, classificacaoPeriodicoRequestDTO);
        registrarLog(veiculoPublicacaoAtual.getStatus(), classificacaoPeriodicoRequestDTO, veiculoPublicacaoAtual, idUser);
        return VeiculoPublicacaoDTO.buildVeiculoDto(veiculoPublicacaoAtual);

    }


    public void avaliarPublicacao(VeiculoPublicacao veiculoPublicacaoAtual, StatusVeiculo statusVeiculo, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO, UUID idUser){

        classificarPredatorio(veiculoPublicacaoAtual, classificacaoPeriodicoRequestDTO, idUser);
        veiculoPublicacaoAtual.setStatus(statusVeiculo);
        veiculoPublicacaoRepository.save(veiculoPublicacaoAtual);

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


    private void classificarPredatorio(VeiculoPublicacao veiculoPublicacaoAtual, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO, UUID idUser) {
        if (veiculoPublicacaoAtual.getTipo() == TipoVeiculo.periodico){
            classificarPeriodicoPredatorioService.classificarPeriodico(veiculoPublicacaoAtual, classificacaoPeriodicoRequestDTO, idUser);
        }
    }

    private void classificarAdequacaoDefesa(VeiculoPublicacao veiculoPublicacaoAtual){

        Map<String, Integer> prioridade = new HashMap<>();

        prioridade.put("a1", 8);
        prioridade.put("a2", 7);
        prioridade.put("a3", 6);
        prioridade.put("a4", 5);
        prioridade.put("a5", 4);
        prioridade.put("a6", 3);
        prioridade.put("a7", 2);
        prioridade.put("a8", 1);

        if (veiculoPublicacaoAtual.getTipo().equals(TipoVeiculo.evento)) {
            if (prioridade.get(veiculoPublicacaoAtual.getClassificacao().getCodigo()) < prioridade.get("a6")) {
                veiculoPublicacaoAtual.setAdequadoDefesa(AdequacaoDefesa.nenhum);
            } if ((prioridade.get(veiculoPublicacaoAtual.getClassificacao().getCodigo()) >= prioridade.get("a6")
                    && prioridade.get(veiculoPublicacaoAtual.getClassificacao().getCodigo()) <= prioridade.get("a3"))
                    || (veiculoPublicacaoAtual.getVinculoSbc().equals(VinculoSBC.vinculo_comum)
                    || veiculoPublicacaoAtual.getVinculoSbc().equals(VinculoSBC.vinculo_top_20))) {
                veiculoPublicacaoAtual.setAdequadoDefesa(AdequacaoDefesa.mestrado);
            } if (prioridade.get(veiculoPublicacaoAtual.getClassificacao().getCodigo()) >= prioridade.get("a2")) {
                veiculoPublicacaoAtual.setAdequadoDefesa(AdequacaoDefesa.mestrado_doutorado);
            }
        } else {
            Periodico periodico = periodicoRepository.findById(veiculoPublicacaoAtual.getIdVeiculo()).orElseThrow();
            double percentilJcr = periodico.getPercentilJcr() == null ? 0.0 : periodico.getPercentilJcr();
            double percentilScopus = periodico.getPercentilJcr() == null ? 0.0 : periodico.getPercentilScopus();
            double maxPercentil = Math.max(percentilJcr, percentilScopus);

            if (maxPercentil < 25){
                periodico.setAdequadoDefesa(AdequacaoDefesa.nenhum);
            } else if (maxPercentil < 50){
                periodico.setAdequadoDefesa(AdequacaoDefesa.mestrado);
            } else {
                periodico.setAdequadoDefesa(AdequacaoDefesa.mestrado_doutorado);
            }
        }

    }

}
