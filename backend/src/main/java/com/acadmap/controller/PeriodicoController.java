package com.acadmap.controller;

import com.acadmap.model.dto.periodico.ClassificacaoPeriodicoRequestDTO;
import com.acadmap.model.dto.periodico.PeriodicoResponseDTO;
import com.acadmap.model.dto.periodico.PeriodicoRequestDTO;
import com.acadmap.model.entities.Periodico;
import com.acadmap.service.ClassificarPeriodicoService;
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
    private final ClassificarPeriodicoService classificarPeriodicoService;

    @PostMapping
    public ResponseEntity<PeriodicoResponseDTO> criarPeriodico(@RequestBody PeriodicoRequestDTO dto,
                                                               @RequestHeader("X-User-Id") UUID idUser,
                                                               @RequestParam(defaultValue = "false") boolean forcar) {
        System.out.println("FORCAR: " + forcar);
        PeriodicoResponseDTO dtoresponseperiodico = this.criarPeriodicoService.criarPeriodico(dto, idUser, forcar);
        return ResponseEntity.status(HttpStatus.CREATED).body(dtoresponseperiodico);
    }

    @PatchMapping("/{idPeriodico}/classificar")
    public ResponseEntity<PeriodicoResponseDTO> classificarPeriodico(@PathVariable UUID idPeriodico,
                                                                     @RequestBody ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO,
                                                                     @RequestHeader("X-User-Id") UUID idUser) {
        System.out.println(idUser);
        Periodico periodicoAtualizado = classificarPeriodicoService.classificarPeriodico(idPeriodico, classificacaoPeriodicoRequestDTO, idUser);

        PeriodicoResponseDTO periodicoResponseDTO = new PeriodicoResponseDTO(periodicoAtualizado);

        return ResponseEntity.ok(periodicoResponseDTO);
    }
}

