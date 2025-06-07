package com.acadmap.repository;

import com.acadmap.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
    Optional<Usuario> findByNome(String nome);

}
