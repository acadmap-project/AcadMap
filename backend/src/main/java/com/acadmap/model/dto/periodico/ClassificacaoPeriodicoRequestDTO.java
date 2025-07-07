package com.acadmap.model.dto.periodico;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClassificacaoPeriodicoRequestDTO {
    private boolean flagPredatorio; // Valor do checkbox
}