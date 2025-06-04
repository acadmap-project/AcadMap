package com.acadmap.controller;

import com.acadmap.model.Usuario;
import com.acadmap.model.Programa;
import com.acadmap.model.AreaPesquisa;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.repository.ProgramaRepository;
import com.acadmap.repository.AreaPesquisaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final ProgramaRepository programaRepository;
    private final AreaPesquisaRepository areaPesquisaRepository;

    public UsuarioController(
            UsuarioRepository usuarioRepository,
            ProgramaRepository programaRepository,
            AreaPesquisaRepository areaPesquisaRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.programaRepository = programaRepository;
        this.areaPesquisaRepository = areaPesquisaRepository;
    }

    @PostMapping
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        UUID areaId = usuario.getAreaPesquisa().getId();
        UUID progId = usuario.getPrograma().getId();

        AreaPesquisa area = areaPesquisaRepository.findById(areaId)
                .orElseThrow(() -> new RuntimeException("Área de pesquisa não encontrada"));

        Programa programa = programaRepository.findById(progId)
                .orElseThrow(() -> new RuntimeException("Programa não encontrado"));

        usuario.setAreaPesquisa(area);
        usuario.setPrograma(programa);

        return usuarioRepository.save(usuario);
    }

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}
