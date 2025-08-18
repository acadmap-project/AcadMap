package com.acadmap.security.service;

import com.acadmap.model.entities.RefreshToken;
import com.acadmap.model.entities.Usuario;
import com.acadmap.repository.RefreshTokenRepository;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.security.dto.TokenDTO;
import com.acadmap.security.provider.JwtService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AutorizacaoServiceRsa {

    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UsuarioRepository usuarioRepository;
    @Value("${jwt.ttl}")
    private Duration ttl;

    public TokenDTO autenticacao(Authentication authentication){

        Usuario usuario = usuarioRepository.findByNome(authentication.getName()).orElseThrow();
        refreshTokenRepository.deleteAllByUsuario(usuario);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUsuario(usuario);
        refreshToken.setExpiresAt(LocalDateTime.now().plus(ttl));
        refreshTokenRepository.save(refreshToken);

        return new TokenDTO(jwtService.generateToken(authentication), refreshToken.getIdRefreshToken());
    }

    public TokenDTO refreshToken(UUID refreshTokenUUID, String bearerToken){
        final RefreshToken refreshTokenEntity = refreshTokenRepository
                .findByIdRefreshToken(refreshTokenUUID)
                .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Não existe token relacionado a este id"
                        )
                );

//        if(refreshTokenRepository.existsByIdRefreshTokenAndExpiresAtAfter(refreshTokenUUID, LocalDateTime.now())){
//            refreshTokenRepository.deleteAllByUsuario(refreshTokenEntity.getUsuario());
//            throw new ResponseStatusException(
//                    HttpStatus.FORBIDDEN, "O token expirou, faça o login novamente");
//        }

        refreshTokenEntity.setExpiresAt(LocalDateTime.now().plus(ttl));

        final String newAccessToken = jwtService.generateRefreshToken(bearerToken.substring(7));

        return new TokenDTO(newAccessToken, refreshTokenUUID);
    }

    public void revokeRefreshToken(UUID refreshTokenUUID) {
        RefreshToken refreshToken = refreshTokenRepository.findById(refreshTokenUUID).orElseThrow(
                EntityNotFoundException::new
        );
        refreshTokenRepository.deleteAllByUsuario(refreshToken.getUsuario());
    }

}
