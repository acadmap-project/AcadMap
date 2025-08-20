package com.acadmap.controller;

import com.acadmap.model.dto.evento.EventoCreateDTO;
import com.acadmap.model.dto.evento.EventoResponseDTO;
import com.acadmap.model.dto.evento.EventoVisualizacaoDTO;
import com.acadmap.model.dto.veiculo.FiltroVeiculoRequestDTO;
import com.acadmap.model.dto.evento.EventoResumoListaDTO;
import com.acadmap.service.CriarEventoService;
import com.acadmap.service.EventoConsultaService;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.model.entities.Usuario;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/eventos")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EventoController {

  private final CriarEventoService criarEventoService;
  private final EventoConsultaService eventoConsultaService;
  private final UsuarioRepository usuarioRepository;

  @PostMapping
  public ResponseEntity<EventoResponseDTO> criarEvento(@RequestBody EventoCreateDTO dto,
      Authentication authentication,
      @RequestParam(defaultValue = "false") boolean forcar) {
    UUID idUser = getUserIdFromAuthentication(authentication);
    EventoResponseDTO dtoreponseevento = this.criarEventoService.criarEvento(dto, idUser, forcar);
    return ResponseEntity.status(HttpStatus.CREATED).body(dtoreponseevento);
  }

  @GetMapping("/{id}")
  public ResponseEntity<EventoVisualizacaoDTO> consultaPorId(@PathVariable UUID id) {
    EventoVisualizacaoDTO eventoDto = this.eventoConsultaService.consultaPorId(id);

    return ResponseEntity.status(HttpStatus.OK).body(eventoDto);
  }

  @PostMapping("/listar")
  public ResponseEntity<List<EventoResumoListaDTO>> listarComFiltros(@RequestBody(required = false) FiltroVeiculoRequestDTO filtro) {
    FiltroVeiculoRequestDTO filtroTratado = (filtro == null) ? new FiltroVeiculoRequestDTO() : filtro;
    List<EventoResumoListaDTO> eventos = eventoConsultaService.listarComFiltros(filtroTratado);
    return ResponseEntity.ok(eventos);
  }

  @Deprecated
  @GetMapping("/listar")
  public ResponseEntity<List<EventoResumoListaDTO>> listarEventosAprovados(
          @RequestParam(required = false) String nome) {

    List<EventoResumoListaDTO> eventos = eventoConsultaService.listarAprovados(nome);
    return ResponseEntity.ok(eventos);
  }

  private UUID getUserIdFromAuthentication(Authentication authentication) {
    if (authentication instanceof JwtAuthenticationToken jwtToken) {
      Jwt jwt = jwtToken.getToken();
      String email = jwt.getSubject();
      
      Usuario usuario = usuarioRepository.findByEmail(email)
              .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));
      
      return usuario.getIdUsuario();
    }
    
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Tipo de autenticação não suportado");
  }

}
