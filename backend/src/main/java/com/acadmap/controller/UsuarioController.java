package com.acadmap.controller;

import com.acadmap.repository.UsuarioRepository;
import com.acadmap.model.dto.usuario.UsuarioRequestDTO;
import com.acadmap.model.dto.usuario.UsuarioResponseDTO;
import com.acadmap.service.CriarUsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("api/usuario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

  private final CriarUsuarioService criarUsuarioService;
  private final UsuarioRepository usuarioRepository;

  @PostMapping("/cadastro")
  public ResponseEntity<UsuarioResponseDTO> criarUsuario(
      @RequestBody UsuarioRequestDTO dtoRequest) {
    UsuarioResponseDTO dtoResponse = this.criarUsuarioService.criarUsuario(dtoRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(dtoResponse);
  }

  @GetMapping
  public ResponseEntity<?> retornarUsuarios(){

    List<UsuarioResponseDTO> listaDeUsuarios = usuarioRepository.findAll().stream()
            .map(UsuarioResponseDTO::new).collect(Collectors.toList());

    if (listaDeUsuarios.isEmpty()){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    return ResponseEntity.status(HttpStatus.FOUND).body(listaDeUsuarios);

  }

}
