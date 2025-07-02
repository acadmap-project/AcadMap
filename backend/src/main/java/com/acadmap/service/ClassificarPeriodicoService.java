package com.acadmap.service;

import com.acadmap.model.dto.periodico.ClassificacaoPeriodicoRequestDTO;
import com.acadmap.model.entities.Periodico;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.TipoPerfilUsuario;
import com.acadmap.repository.PeriodicoRepository;
import com.acadmap.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@AllArgsConstructor
public class ClassificarPeriodicoService {

    private final PeriodicoRepository periodicoRepository;
    private final UsuarioRepository usuarioRepository;

    public Periodico classificarPeriodico(UUID idPeriodico, ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO, UUID idUser) {
        // Verificar o usuário e suas permissões
        System.out.println(idUser);
        Usuario usuario = usuarioRepository.findById(idUser).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        TipoPerfilUsuario tipoPerfilUsuario = usuario.getTipoPerfil();

        if (tipoPerfilUsuario != TipoPerfilUsuario.administrador && tipoPerfilUsuario != TipoPerfilUsuario.auditor) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado. Apenas administradores e auditores podem classificar periódicos.");
        }

        Periodico periodico = periodicoRepository.findById(idPeriodico).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Periódico não encontrado."));

        periodico.setFlagPredatorio(classificacaoPeriodicoRequestDTO.isFlagPredatorio());

        return periodicoRepository.save(periodico);
    }
}