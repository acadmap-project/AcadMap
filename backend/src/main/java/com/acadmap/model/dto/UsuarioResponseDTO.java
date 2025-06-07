package com.acadmap.model.dto;

import com.acadmap.model.entities.AreaPesquisa;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.TipoPerfilUsuario;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record UsuarioResponseDTO(UUID idUsuario, String nome, String email,
    TipoPerfilUsuario tipoPerfil, UUID idPrograma, Set<UUID> idsAreasPesquisa) {
  public UsuarioResponseDTO(Usuario usuario) {
    this(usuario.getIdUsuario(), usuario.getNome(), usuario.getEmail(), usuario.getTipoPerfil(),
        usuario.getPrograma().getIdPrograma(), usuario.getAreasPesquisa().stream()
            .map(AreaPesquisa::getIdAreaPesquisa).collect(Collectors.toSet()));
  }
}
