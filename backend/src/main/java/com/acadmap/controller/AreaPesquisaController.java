package com.acadmap.controller;

import com.acadmap.model.AreaPesquisa;
import com.acadmap.repository.AreaPesquisaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/area")
public class AreaPesquisaController {

    private final AreaPesquisaRepository areaPesquisaRepository;

    public AreaPesquisaController(AreaPesquisaRepository areaPesquisaRepository) {
        this.areaPesquisaRepository = areaPesquisaRepository;
    }

    @PostMapping
    public AreaPesquisa criarArea(@RequestBody AreaPesquisa areaPesquisa) {
        return areaPesquisaRepository.save(areaPesquisa);
    }

    @GetMapping
    public List<AreaPesquisa> listarAreas() {
        return areaPesquisaRepository.findAll();
    }
}
