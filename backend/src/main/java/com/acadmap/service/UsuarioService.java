package com.acadmap.service;

import com.acadmap.model.dto.UsuarioRequestDTO;
import com.acadmap.model.dto.UsuarioResponseDTO;
import com.acadmap.model.entities.AreaPesquisa;
import com.acadmap.model.entities.Programa;
import com.acadmap.model.entities.Usuario;
import com.acadmap.repository.AreaPesquisaRepository;
import com.acadmap.repository.ProgramaRepository;
import com.acadmap.repository.UsuarioRepository;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UsuarioService {
  private final UsuarioRepository usuarioRepository;
  private final AreaPesquisaRepository areaPesquisaRepository;
  private final ProgramaRepository programaRepository;
  private final LogService logService;

  public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO usuarioRequestDTO) {
    Programa programa = this.buscaPrograma(usuarioRequestDTO.idPrograma());
    Set<AreaPesquisa> areas = this.carregaAreasPesquisa(usuarioRequestDTO.idsAreasPesquisa());

    Optional<Usuario> usuarioOpt = this.usuarioRepository.findByEmail(usuarioRequestDTO.email());
    if (usuarioOpt.isPresent()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "EMAIL_DUPLICADO");
    }

    Usuario usuario = new Usuario();
    BeanUtils.copyProperties(usuarioRequestDTO, usuario, "idPrograma", "idsAreasPesquisa");
    usuario.setPrograma(programa);
    usuario.setAreasPesquisa(areas);
    Usuario usuarioPersistido = this.usuarioRepository.save(usuario);
    this.logService.registraCadastroUsuario(usuarioPersistido);

    return new UsuarioResponseDTO(usuarioPersistido);
  }

  private Programa buscaPrograma(UUID id) {
    return this.programaRepository.findById(id).orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PROGRAMA_NAO_ENCONTRADO"));
  }

  private Set<AreaPesquisa> carregaAreasPesquisa(Set<UUID> ids) {
    return ids.stream()
        .map(id -> this.areaPesquisaRepository.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "AREA_NAO_ENCONTRADA")))
        .collect(Collectors.toSet());
  }
}
