package com.acadmap.controller;

import com.acadmap.model.dto.log_veiculo.LogVeiculoDTO;
import com.acadmap.service.ListarLogVeiculoService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
// @CrossOrigin(origins = "*")
@RequestMapping("api/log-veiculo")
@RequiredArgsConstructor
public class LogVeiculoController {

  private final ListarLogVeiculoService listarLogVeiculoService;

  @GetMapping("/historico")
  public ResponseEntity<List<LogVeiculoDTO>> historicoLogs() {
    List<LogVeiculoDTO> logsDto = this.listarLogVeiculoService.historicoLogs();
    return ResponseEntity.ok(logsDto);
  }

}
