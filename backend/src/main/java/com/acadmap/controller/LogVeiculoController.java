package com.acadmap.controller;

import com.acadmap.model.dto.AcaoLogDTO;
import com.acadmap.model.dto.log_veiculo.LogVeiculoDTO;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.AcaoLog;
import com.acadmap.model.enums.TipoPerfilUsuario;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.service.ListarLogVeiculoService;
import java.util.List;
import java.util.UUID;

import com.acadmap.service.RegistrarLogService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/log-veiculo")
@RequiredArgsConstructor
public class LogVeiculoController {

  private final ListarLogVeiculoService listarLogVeiculoService;
  private final RegistrarLogService registrarLogService;
  @Autowired
  private UsuarioRepository usuarioRepository ;

  @GetMapping("/historico")
  public ResponseEntity<List<LogVeiculoDTO>> historicoLogs(Authentication authentication){
     UUID idUser = getUserIdFromAuthentication(authentication);

     if (this.isAuditor(idUser) || this.isPesquisador(idUser)){
       throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED, "Usuário não possui acesso");
     }

     List<LogVeiculoDTO> logsDto = this.listarLogVeiculoService.historicoLogs();
     return ResponseEntity.ok(logsDto);
  }


  private boolean isPesquisador(UUID idUser){
    Usuario usuario = usuarioRepository.findById(idUser).orElseThrow(EntityNotFoundException::new);
    return usuario.getTipoPerfil().getCodigo().contains(TipoPerfilUsuario.pesquisador.getCodigo());
  }

  private boolean isAuditor(UUID idUser){
    Usuario usuario = usuarioRepository.findById(idUser).orElseThrow(EntityNotFoundException::new);
    return usuario.getTipoPerfil().getCodigo().contains(TipoPerfilUsuario.auditor.getCodigo());
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
