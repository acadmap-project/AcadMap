package com.acadmap.controller;

import com.acadmap.model.dto.evento.EventoCreateDTO;
import com.acadmap.model.dto.evento.EventoResponseDTO;
import com.acadmap.model.dto.evento.EventoVisualizacaoDTO;
import com.acadmap.service.CriarEventoService;
import com.acadmap.service.EventoConsultaService;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/eventos")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EventoController {

  private final CriarEventoService criarEventoService;
  private final EventoConsultaService eventoConsultaService;

  @PostMapping
  public ResponseEntity<EventoResponseDTO> criarEvento(@RequestBody EventoCreateDTO dto,
      @RequestHeader("X-User-Id") UUID idUser,
      @RequestParam(defaultValue = "false") boolean forcar) {
    EventoResponseDTO dtoreponseevento = this.criarEventoService.criarEvento(dto, idUser, forcar);
    return ResponseEntity.status(HttpStatus.CREATED).body(dtoreponseevento);
  }

  @GetMapping("/{id}")
  public ResponseEntity<EventoVisualizacaoDTO> consultaPorId(@PathVariable UUID id) {
    EventoVisualizacaoDTO eventoDto = this.eventoConsultaService.consultaPorId(id);

    return ResponseEntity.status(HttpStatus.OK).body(eventoDto);
  }

}
