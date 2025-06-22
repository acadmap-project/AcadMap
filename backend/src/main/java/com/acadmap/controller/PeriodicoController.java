package com.acadmap.controller;

import com.acadmap.model.dto.periodico.PeriodicoResponseDTO;
import com.acadmap.model.dto.periodico.PeriodicoResquestDTO;
import com.acadmap.service.CriarPeriodicoService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/periodicos/cadastro")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class PeriodicoController {

    private final CriarPeriodicoService criarPeriodicoService;

    @PostMapping
    public ResponseEntity<PeriodicoResponseDTO> criarPeriodico(@RequestBody PeriodicoResquestDTO dto,
                                                               @RequestHeader ("X-User-Id")UUID idUser){

        PeriodicoResponseDTO dtoresponseperiodico = this.criarPeriodicoService.criarPeriodico(dto, idUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(dtoresponseperiodico);
    }

}
