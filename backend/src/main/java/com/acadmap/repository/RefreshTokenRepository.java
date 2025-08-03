package com.acadmap.repository;

import com.acadmap.model.entities.RefreshToken;
import com.acadmap.model.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByIdRefreshTokenAndExpiresAtAfter(UUID id, LocalDateTime date);

    Optional<RefreshToken> findByIdRefreshToken(UUID id);

    boolean existsByIdRefreshTokenAndExpiresAtAfter(UUID id, LocalDateTime date);

    void deleteAllByUsuario(Usuario usuario);
}