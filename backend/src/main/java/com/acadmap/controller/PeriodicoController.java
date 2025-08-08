package com.acadmap.controller;


import com.acadmap.model.dto.periodico.*;
import com.acadmap.model.dto.veiculo.FiltroVeiculoRequestDTO;
import com.acadmap.model.entities.Periodico;
import com.acadmap.model.entities.VeiculoPublicacao;
import com.acadmap.repository.VeiculoPublicacaoRepository;
import com.acadmap.service.ClassificarPeriodicoPredatorioService;
import com.acadmap.service.CriarPeriodicoService;
import com.acadmap.service.PeriodicoConsultaService;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/periodicos")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class PeriodicoController {

  private final CriarPeriodicoService criarPeriodicoService;
  private final ClassificarPeriodicoPredatorioService classificarPeriodicoPredatorioService;
  private final VeiculoPublicacaoRepository veiculoPublicacaoRepository;
  private final PeriodicoConsultaService periodicoConsultaService;

  @PostMapping
  public ResponseEntity<PeriodicoResponseDTO> criarPeriodico(@RequestBody PeriodicoRequestDTO dto,
      @RequestHeader("X-User-Id") UUID idUser,
      @RequestParam(defaultValue = "false") boolean forcar) {
    System.out.println("FORCAR: " + forcar);
    PeriodicoResponseDTO dtoresponseperiodico =
        this.criarPeriodicoService.criarPeriodico(dto, idUser, forcar);
    return ResponseEntity.status(HttpStatus.CREATED).body(dtoresponseperiodico);
  }

    @PatchMapping("/{idPeriodico}/classificar")
    @Deprecated
    public ResponseEntity<PeriodicoResponseDTO> classificarPeriodico(@PathVariable UUID idPeriodico,
                                                                     @RequestBody ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO,
                                                                     @RequestHeader("X-User-Id") UUID idUser) {

        VeiculoPublicacao veiculoPublicacao = veiculoPublicacaoRepository.findById(idPeriodico).orElseThrow();
        Periodico periodicoAtualizado = classificarPeriodicoPredatorioService.classificarPeriodico(veiculoPublicacao, classificacaoPeriodicoRequestDTO, idUser);
   
      PeriodicoResponseDTO periodicoResponseDTO = new PeriodicoResponseDTO(periodicoAtualizado);
      return ResponseEntity.ok(periodicoResponseDTO);
  }

 @GetMapping("/{id}")
  public ResponseEntity<PeriodicoVisualizacaoDTO> consultaPorId(@PathVariable UUID id) {
    PeriodicoVisualizacaoDTO periodicoDto = this.periodicoConsultaService.consultaPorId(id);
    return ResponseEntity.status(HttpStatus.OK).body(periodicoDto);
  }

  @PostMapping("/listar")
    public ResponseEntity<List<PeriodicoResumoListaDTO>> listarComFiltros(@RequestBody(required = false) FiltroVeiculoRequestDTO filtro) {
        FiltroVeiculoRequestDTO filtroTratado = (filtro == null) ? new FiltroVeiculoRequestDTO() : filtro;
        List<PeriodicoResumoListaDTO> periodicos = periodicoConsultaService.listarComFiltros(filtroTratado);
        return ResponseEntity.ok(periodicos);
    }

  @Deprecated
  @GetMapping("/listar")
  public ResponseEntity<List<PeriodicoResumoListaDTO>> listarPeriodicosAprovados(
          @RequestParam(required = false) String nome) {

    List<PeriodicoResumoListaDTO> periodicos = periodicoConsultaService.listarAprovados(nome);

    return ResponseEntity.ok(periodicos);
  }

}

