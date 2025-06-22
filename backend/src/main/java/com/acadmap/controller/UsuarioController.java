package com.acadmap.controller;

import com.acadmap.model.dto.usuario.UsuarioRequestDTO;
import com.acadmap.model.dto.usuario.UsuarioResponseDTO;
import com.acadmap.service.CriarUsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/usuario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {
  private final CriarUsuarioService criarUsuarioService;

  @PostMapping("/cadastro")
  public ResponseEntity<UsuarioResponseDTO> criarUsuario(
      @RequestBody UsuarioRequestDTO dtoRequest) {
    UsuarioResponseDTO dtoResponse = this.criarUsuarioService.criarUsuario(dtoRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(dtoResponse);
  }


}
