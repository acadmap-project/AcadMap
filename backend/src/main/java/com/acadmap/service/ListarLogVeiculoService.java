package com.acadmap.service;

import com.acadmap.model.dto.log_veiculo.LogVeiculoDTO;
import com.acadmap.model.entities.JustificativaRecusa;
import com.acadmap.model.entities.LogVeiculo;
import com.acadmap.model.enums.AcaoLog;
import com.acadmap.repository.LogVeiculoRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarLogVeiculoService {

  private final LogVeiculoRepository logVeiculoRepository;

  public List<LogVeiculoDTO> historicoLogs() {
    return this.logVeiculoRepository.findAll().stream().map(this::toDto).toList();
  }

  private LogVeiculoDTO toDto(LogVeiculo log) {
    LogVeiculoDTO dto = new LogVeiculoDTO();
    dto.setIdUsuario(log.getUsuario().getIdUsuario());
    dto.setIdVeiculo(log.getVeiculo().getIdVeiculo());
    dto.setAcao(this.mapAcao(log.getAcao()));
    dto.setStatusVeiculo(this.mapStatus(log.getAcao()));
    dto.setTimestamp(log.getDataHora());
    dto.setJustificativaNegacao(this.verificaJustificativa(log.getJustificativaRecusa()));
    return dto;
  }

  private String mapAcao(AcaoLog acao) {
    return switch (acao) {
      case adicao_veiculo -> "Submissão";
      case cadastro_veiculo_aceito -> "Aprovação";
      case cadastro_veiculo_recusado -> "Negação";
      default -> acao.getCodigo();
    };
  }

  private String mapStatus(AcaoLog status) {
    return switch (status) {
      case adicao_veiculo -> "Pendente";
      case cadastro_veiculo_aceito -> "Aprovado";
      case cadastro_veiculo_recusado -> "Negado";
      default -> status.getCodigo();
    };
  }

  private String verificaJustificativa(JustificativaRecusa justificativa) {
    return Optional.ofNullable(justificativa).map(JustificativaRecusa::getJustificativa)
        .orElse(null);
  }
}
