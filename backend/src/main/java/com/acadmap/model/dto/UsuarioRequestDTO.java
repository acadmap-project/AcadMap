package com.acadmap.model.dto;

import com.acadmap.model.enums.TipoPerfilUsuario;
import java.util.Set;
import java.util.UUID;

public record UsuarioRequestDTO(String nome, String email, String senha,
    TipoPerfilUsuario tipoPerfil, UUID idPrograma, Set<UUID> idsAreasPesquisa) {

}
