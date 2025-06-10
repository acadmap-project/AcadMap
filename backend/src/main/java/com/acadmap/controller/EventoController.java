package com.acadmap.controller;

import com.acadmap.model.dto.EventoCreateDTO;
import com.acadmap.model.entities.Evento;
import com.acadmap.model.entities.Usuario;
import com.acadmap.service.EventoService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/eventos/cadastro")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EventoController {

  private final EventoService eventoService;

  @PostMapping("/{id}")
  public ResponseEntity<Evento> criarEvento(@RequestBody EventoCreateDTO dto,
                                            @RequestHeader("X-User-Id") UUID idUser) {
    Evento evento = this.eventoService.criarEvento(dto, idUser);
    return ResponseEntity.status(HttpStatus.CREATED).body(evento);
  }
}
