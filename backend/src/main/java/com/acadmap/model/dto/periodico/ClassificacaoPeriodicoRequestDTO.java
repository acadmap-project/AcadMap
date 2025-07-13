package com.acadmap.model.dto.periodico;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties
public class ClassificacaoPeriodicoRequestDTO {
    private boolean flagPredatorio; // Valor do checkbox
    private String justificativa;
}