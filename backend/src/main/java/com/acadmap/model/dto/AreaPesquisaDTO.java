package com.acadmap.model.dto;

import java.util.UUID;
import com.acadmap.model.entities.AreaPesquisa;

public record AreaPesquisaDTO(UUID id, String nome) {
  public AreaPesquisaDTO(AreaPesquisa areaPesquisa) {
    this(areaPesquisa.getIdAreaPesquisa(), areaPesquisa.getNome());
  }
}
