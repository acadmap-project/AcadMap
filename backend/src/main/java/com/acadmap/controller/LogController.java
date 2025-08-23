package com.acadmap.controller;

import com.acadmap.model.dto.AcaoLogDTO;
import com.acadmap.model.dto.log.LogDTO;
import com.acadmap.model.dto.log_erro.LogErroDTO;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.AcaoLog;
import com.acadmap.model.enums.TipoPerfilUsuario;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.service.ListarLogsAcaoesService;
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

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin (origins = "*")
@RequestMapping("api/log")
@RequiredArgsConstructor
public class LogController {

    @Autowired
    private final UsuarioRepository usuarioRepository;
    private final RegistrarLogService registrarLogService;
    private final ListarLogsAcaoesService listarLogsAcaoesService;


    @PostMapping("/adicionar")
    public ResponseEntity<?> adicionarLog (@RequestBody AcaoLogDTO acaolog , Authentication authentication) {

        AcaoLog acaoLog = AcaoLog.doValor(acaolog.acao());
        if ( authentication != null && authentication.isAuthenticated()) {

            UUID idUser = getUserIdFromAuthentication(authentication);
            Usuario usuario = usuarioRepository.findByIdAndFetchProgramaEagerly(idUser).orElseThrow(EntityNotFoundException::new);
            registrarLogService.gerarLogUsuario(usuario, acaoLog);
        }
        else {registrarLogService.gerarLogUsuario(acaoLog);}
        return ResponseEntity.status(HttpStatus.CREATED).body(acaoLog);
    }

    @GetMapping ("/historico")
    public ResponseEntity<?> listarLogsAcoes (Authentication authentication){
        UUID idUser = getUserIdFromAuthentication(authentication);

        if (this.isAuditor(idUser) || this.isPesquisador(idUser)){
            throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED, "Usuário não possui acesso");
        }

        List<LogDTO> logsAcoes = this.listarLogsAcaoesService.listarLogsAcoes();
        return ResponseEntity.ok(logsAcoes);
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
    private boolean isPesquisador(UUID idUser){
        Usuario usuario = usuarioRepository.findById(idUser).orElseThrow(EntityNotFoundException::new);
        return usuario.getTipoPerfil().getCodigo().contains(TipoPerfilUsuario.pesquisador.getCodigo());
    }

    private boolean isAuditor(UUID idUser){
        Usuario usuario = usuarioRepository.findById(idUser).orElseThrow(EntityNotFoundException::new);
        return usuario.getTipoPerfil().getCodigo().contains(TipoPerfilUsuario.auditor.getCodigo());
    }

}

