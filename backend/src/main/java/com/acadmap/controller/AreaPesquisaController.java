package com.acadmap.controller;

import com.acadmap.model.dto.AreaPesquisaDTO;
import com.acadmap.repository.AreaPesquisaRepository;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("api/areas")
@RequiredArgsConstructor
public class AreaPesquisaController {
  private final AreaPesquisaRepository areaPesquisaRepository;

  @GetMapping("/listar")
  public ResponseEntity<List<AreaPesquisaDTO>> listarAreasPesquisa() {
    List<AreaPesquisaDTO> areasDto = this.areaPesquisaRepository.findAll().stream()
        .map(AreaPesquisaDTO::new).sorted(Comparator.comparing(AreaPesquisaDTO::nome)).toList();
    return ResponseEntity.ok(areasDto);
  }

}
