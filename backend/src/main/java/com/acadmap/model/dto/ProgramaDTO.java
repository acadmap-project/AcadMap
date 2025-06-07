package com.acadmap.model.dto;

import com.acadmap.model.entities.Programa;
import java.util.UUID;

public record ProgramaDTO(UUID id, String nome) {
  public ProgramaDTO(Programa programa) {
    this(programa.getIdPrograma(), programa.getNome());
  }
}
