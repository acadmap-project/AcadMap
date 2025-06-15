package com.acadmap.controller;

import com.acadmap.model.dto.UsuarioRequestDTO;
import com.acadmap.model.dto.UsuarioResponseDTO;
import com.acadmap.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/usuario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {
  private final UsuarioService usuarioService;

  @PostMapping("/cadastro")
  public ResponseEntity<UsuarioResponseDTO> criarUsuario(
      @RequestBody UsuarioRequestDTO dtoRequest) {
    UsuarioResponseDTO dtoResponse = this.usuarioService.criarUsuario(dtoRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(dtoResponse);
  }


}
