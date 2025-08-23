package com.acadmap.controller;

import com.acadmap.model.dto.log_erro.LogErroDTO;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.TipoPerfilUsuario;
import com.acadmap.repository.LogErroRepository;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.service.ListarLogErroService;
import com.acadmap.service.RegistrarLogService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
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
@CrossOrigin(origins = "*")
@RequestMapping("api/log-erro")
@RequiredArgsConstructor
public class LogErroController {

    private final LogErroRepository logErroRepository;
    private final ListarLogErroService listarLogErroService ;
    private final UsuarioRepository usuarioRepository;
    private final RegistrarLogService registrarLogService;

    @PostMapping("/adicionar")
    public ResponseEntity<?> adicionarLogErro (@RequestBody String descricaoErro, Authentication authentication){

        if (authentication !=null && authentication.isAuthenticated()) {

        UUID idUser = getUserIdFromAuthentication(authentication);
        Usuario usuario = usuarioRepository.findByIdAndFetchProgramaEagerly(idUser).orElseThrow(EntityNotFoundException::new);

        registrarLogService.gerarLogErro(usuario, descricaoErro) ;
        }

        else { registrarLogService.gerarLogErro(descricaoErro);}

        return ResponseEntity.status(HttpStatus.CREATED).body("Log Registrado");

    }

    @GetMapping("/historico")
    public ResponseEntity<List<LogErroDTO>> historicoLogErro (Authentication authentication){
        UUID idUser = getUserIdFromAuthentication(authentication);

        if (this.isAuditor(idUser) || this.isPesquisador(idUser)){
            throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED, "Usuário não possui acesso");
        }

        List<LogErroDTO> logsErros = this.listarLogErroService.historicoLogsErro();
        return ResponseEntity.ok(logsErros);
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
