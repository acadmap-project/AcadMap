package com.acadmap.controller;

import com.acadmap.model.dto.log_veiculo.LogVeiculoDTO;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.TipoPerfilUsuario;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.service.ListarLogVeiculoService;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/log-veiculo")
@RequiredArgsConstructor
public class LogVeiculoController {

  private final ListarLogVeiculoService listarLogVeiculoService;
  @Autowired
  private UsuarioRepository usuarioRepository ;

  @GetMapping("/historico")
  public ResponseEntity<List<LogVeiculoDTO>> historicoLogs(@RequestHeader("X-User-Id") UUID idUser){

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


}
