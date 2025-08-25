package com.acadmap.service;

import com.acadmap.model.dto.log_erro.LogErroDTO;
import com.acadmap.model.entities.*;
import com.acadmap.model.enums.AcaoLog;
import com.acadmap.repository.JustificativaRecusaRepository;
import com.acadmap.repository.LogErroRepository;
import com.acadmap.repository.LogRepository;
import com.acadmap.repository.LogVeiculoRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.ZoneId;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class RegistrarLogService {
  private final LogRepository logRepository;
  private final LogVeiculoRepository logVeiculoRepository;
  private final JustificativaRecusaRepository justificativaRecusaRepository;
  private final LogErroRepository logErroRepository;

  public void registrarNegarVeiculo(VeiculoPublicacao veiculoPublicacao, Usuario usuario, JustificativaRecusa justificativaRecusa) {
    LogVeiculo logVeiculo = gerarLogVeiculo(veiculoPublicacao, usuario, AcaoLog.cadastro_veiculo_recusado);
    justificativaRecusa.setLogVeiculo(logVeiculo);
    justificativaRecusaRepository.save(justificativaRecusa);
  }

  public LogVeiculo gerarLogVeiculo(VeiculoPublicacao veiculoPublicacao, Usuario usuario, AcaoLog acaoLog) {
    LogVeiculo logVeiculo = new LogVeiculo();
    logVeiculo.setUsuario(usuario);
    logVeiculo.setDataHora(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
    logVeiculo.setAcao(acaoLog);
    logVeiculo.setVeiculo(veiculoPublicacao);
    this.logVeiculoRepository.save(logVeiculo);
    return logVeiculo;
  }

  public void gerarLogUsuario(Usuario usuario, AcaoLog acaoLog) {
    Log log = new Log();
    log.setUsuario(usuario);
    log.setDataHora(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
    log.setAcao(acaoLog);
    this.logRepository.save(log);
  }

  public void gerarLogUsuario(AcaoLog acaoLog) {
        Log log = new Log();
        log.setUsuario(null);
        log.setDataHora(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
        log.setAcao(acaoLog);
        this.logRepository.save(log);
    }

  public LogErro gerarLogErro (Usuario usuario,String descricaoErro){
      LogErro logErro = new LogErro();
      logErro.setUsuario(usuario);
      logErro.setAcao(AcaoLog.erro_requisicao);
      logErro.setDescricaoErro(descricaoErro);
      logErro.setDataHora(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
      this.logErroRepository.save(logErro);
      return logErro;
  }
    public LogErro gerarLogErro (String descricaoErro){
        LogErro logErro = new LogErro();
        logErro.setUsuario(null);
        logErro.setAcao(AcaoLog.erro_requisicao);
        logErro.setDescricaoErro(descricaoErro);
        logErro.setDataHora(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
        this.logErroRepository.save(logErro);
        return logErro;
    }

}