package com.acadmap.controller;

import com.acadmap.model.dto.ProgramaDTO;
import com.acadmap.repository.ProgramaRepository;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("api/programa")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProgramaController {
  private final ProgramaRepository programaRepository;

  @GetMapping("/listar")
  public ResponseEntity<List<ProgramaDTO>> listarProgramas() {
    List<ProgramaDTO> programasDto = this.programaRepository.findAll().stream()
        .map(ProgramaDTO::new).sorted(Comparator.comparing(ProgramaDTO::nome)).toList();
    return ResponseEntity.ok(programasDto);
  }
}
