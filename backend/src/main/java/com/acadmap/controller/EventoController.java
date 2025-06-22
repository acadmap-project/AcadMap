package com.acadmap.controller;

import com.acadmap.model.dto.evento.EventoCreateDTO;
import com.acadmap.model.dto.evento.EventoResponseDTO;
import com.acadmap.service.CriarEventoService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/eventos/cadastro")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EventoController {

  private final CriarEventoService criarEventoService;

  @PostMapping
  public ResponseEntity<EventoResponseDTO> criarEvento(@RequestBody EventoCreateDTO dto,
                                                       @RequestHeader("X-User-Id") UUID idUser) {
    EventoResponseDTO dtoreponseevento = this.criarEventoService.criarEvento(dto, idUser);
    return ResponseEntity.status(HttpStatus.CREATED).body(dtoreponseevento);
  }
}
