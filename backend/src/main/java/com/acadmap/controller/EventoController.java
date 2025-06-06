package com.acadmap.controller;

import com.acadmap.model.DTO.EventoCreateDTO;
import com.acadmap.model.DTO.EventoCreateDTO;
import com.acadmap.model.Evento;
import com.acadmap.service.EventoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
public class EventoController {

    private final EventoService eventoService;

    @PostMapping
    public ResponseEntity<Evento> criarEvento (@RequestBody EventoCreateDTO dto) {
        Evento evento = eventoService.criarEvento(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(evento);
    }
}