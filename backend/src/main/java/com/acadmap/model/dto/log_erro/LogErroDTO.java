package com.acadmap.model.dto.log_erro;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LogErroDTO {

    private UUID idUsuario;
    private String acao;
    private String descricaoErro;
    private LocalDateTime timestamp;

}
