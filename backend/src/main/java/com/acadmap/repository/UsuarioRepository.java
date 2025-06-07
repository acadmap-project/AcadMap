package com.acadmap.repository;

import com.acadmap.model.Usuario;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
  Optional<Usuario> findByNome(String nome);

  Optional<Usuario> findByEmail(String email);

}
