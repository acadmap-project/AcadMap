package com.acadmap.model.dto.log;

import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.AcaoLog;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class LogDTO {
    private UUID idLog;
    private UUID idUsuario;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    private AcaoLog acao;
}
