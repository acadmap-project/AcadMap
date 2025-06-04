package com.acadmap.controller;
import com.acadmap.model.Programa;
import com.acadmap.repository.ProgramaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/programa")
public class ProgramaController {

    private final ProgramaRepository ProgramaRepository;

    public ProgramaController(ProgramaRepository programaRepository) {
        this.ProgramaRepository = programaRepository;
    }

    @PostMapping
    public Programa criarArea(@RequestBody Programa programa) {
        return ProgramaRepository.save(programa);
    }

    @GetMapping
    public List<Programa> listarPrograma() {
        return ProgramaRepository.findAll();
    }
}
