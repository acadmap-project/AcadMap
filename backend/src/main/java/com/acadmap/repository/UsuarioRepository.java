package com.acadmap.repository;

import com.acadmap.model.entities.Usuario;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
  Optional<Usuario> findByNome(String nome);

  Optional<Usuario> findByEmail(String email);

  @Query("SELECT u FROM Usuario u JOIN FETCH u.programa WHERE u.id = (:id)")
  Optional<Usuario> findByIdAndFetchProgramaEagerly(@Param("id") UUID id);
}
