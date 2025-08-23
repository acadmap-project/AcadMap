package com.acadmap.service;

import com.acadmap.model.dto.log.LogDTO;
import com.acadmap.model.entities.Log;
import com.acadmap.model.enums.AcaoLog;
import com.acadmap.repository.LogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListarLogsAcaoesService {

    private final LogRepository logRepository;

    public ListarLogsAcaoesService (LogRepository logRepository){
        this.logRepository = logRepository;
    }

    public List<LogDTO> listarLogsAcoes (){
        List<AcaoLog> acoesAdicionais = List.of(
                AcaoLog.erro_grafico,
                AcaoLog.geracao_csv,
                AcaoLog.geracao_grafico
        );

        List<Log> logsEncontrados = logRepository.findByAcaoIn(acoesAdicionais);

        return logsEncontrados.stream().map(this::logDTO).toList();
    }

        private LogDTO logDTO (Log log) {
            LogDTO dto = new LogDTO();
            dto.setIdLog(log.getIdLog());
            dto.setDataHora(log.getDataHora());
            dto.setAcao(log.getAcao());
            dto.setIdUsuario(log.getUsuario() != null ? log.getUsuario().getIdUsuario() : null);
            return dto;
        }
}
