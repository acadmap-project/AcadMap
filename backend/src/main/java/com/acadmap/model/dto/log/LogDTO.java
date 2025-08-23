package com.acadmap.model.dto.log;

import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.AcaoLog;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class LogDTO {
    private UUID idLog;
    private UUID idUsuario;
    private LocalDateTime dataHora;
    private AcaoLog acao;
}
