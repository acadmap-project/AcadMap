package com.acadmap.service;

import com.acadmap.model.entities.*;
import com.acadmap.model.enums.AcaoLog;
import com.acadmap.repository.LogRepository;
import com.acadmap.repository.LogVeiculoRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistrarLogService {
  private final LogRepository logRepository;
  private final LogVeiculoRepository logVeiculoRepository;

  @Transactional
  public void registraCadastroUsuario(Usuario usuario) {
    Log log = new Log();
    log.setUsuario(usuario);
    log.setDataHora(LocalDateTime.now());
    log.setAcao(AcaoLog.cadastro_usuario);
    this.logRepository.save(log);
  }

  @Transactional
  public void registrarCadastroEvento(Evento evento, Usuario usuario) {
    LogVeiculo logVeiculo = new LogVeiculo();
    logVeiculo.setUsuario(usuario);
    logVeiculo.setDataHora(LocalDateTime.now());
    logVeiculo.setAcao(AcaoLog.adicao_veiculo);
    logVeiculo.setVeiculo(evento);

    this.logVeiculoRepository.save(logVeiculo);
  }

  @Transactional
  public void registrarCadastroPeriodico(Periodico periodico, Usuario usuario) {
    LogVeiculo logVeiculo = new LogVeiculo();
    logVeiculo.setUsuario(usuario);
    logVeiculo.setDataHora(LocalDateTime.now());
    logVeiculo.setAcao(AcaoLog.adicao_veiculo);
    logVeiculo.setVeiculo(periodico);

    this.logVeiculoRepository.save(logVeiculo);
  }


}
