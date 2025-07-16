package com.acadmap.service;

import com.acadmap.model.entities.*;
import com.acadmap.model.enums.AcaoLog;
import com.acadmap.repository.JustificativaRecusaRepository;
import com.acadmap.repository.LogRepository;
import com.acadmap.repository.LogVeiculoRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class RegistrarLogService {
  private final LogRepository logRepository;
  private final LogVeiculoRepository logVeiculoRepository;
  private final JustificativaRecusaRepository justificativaRecusaRepository;

  public void registrarNegarVeiculo(VeiculoPublicacao veiculoPublicacao, Usuario usuario, JustificativaRecusa justificativaRecusa) {
    LogVeiculo logVeiculo = gerarLogVeiculo(veiculoPublicacao, usuario, AcaoLog.cadastro_veiculo_recusado);
    justificativaRecusa.setLogVeiculo(logVeiculo);
    justificativaRecusaRepository.save(justificativaRecusa);
  }

  public LogVeiculo gerarLogVeiculo(VeiculoPublicacao veiculoPublicacao, Usuario usuario, AcaoLog acaoLog) {
    LogVeiculo logVeiculo = new LogVeiculo();
    logVeiculo.setUsuario(usuario);
    logVeiculo.setDataHora(LocalDateTime.now());
    logVeiculo.setAcao(acaoLog);
    logVeiculo.setVeiculo(veiculoPublicacao);
    this.logVeiculoRepository.save(logVeiculo);
    return logVeiculo;
  }

  public void gerarLogUsuario(Usuario usuario, AcaoLog acaoLog) {
    Log log = new Log();
    log.setUsuario(usuario);
    log.setDataHora(LocalDateTime.now());
    log.setAcao(acaoLog);
    this.logRepository.save(log);
  }

}