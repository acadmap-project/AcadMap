package com.acadmap.model.dto.log_veiculo;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LogVeiculoDTO {

  private UUID idUsuario;
  private UUID idVeiculo;
  private String acao;
  private String statusVeiculo;
  private LocalDateTime timestamp;
  private String justificativaNegacao;

}
