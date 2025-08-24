package com.acadmap.service;

import com.acadmap.model.dto.log_erro.LogErroDTO;
import com.acadmap.model.entities.LogErro;
import com.acadmap.model.enums.AcaoLog;
import com.acadmap.repository.LogErroRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListarLogErroService {

    private final LogErroRepository logErroRepository;

    public ListarLogErroService(LogErroRepository logErroRepository) {
        this.logErroRepository = logErroRepository;
    }

    public List<LogErroDTO> historicoLogsErro(){
        return this.logErroRepository.findAll().stream().map(this::toDto).toList();
    }

    private LogErroDTO toDto (LogErro logerro){
        LogErroDTO dto = new LogErroDTO();
        dto.setIdUsuario(logerro.getUsuario() != null ? logerro.getUsuario().getIdUsuario() : null);
        dto.setAcao(this.mapAcao(AcaoLog.erro_requisicao));
        dto.setDescricaoErro(logerro.getDescricaoErro());
        dto.setTimestamp(logerro.getDataHora());
        return dto;

    }

    private String mapAcao(AcaoLog acao) {
        return switch (acao) {
            case adicao_veiculo -> "Submissão";
            case cadastro_veiculo_aceito -> "Aprovação";
            case cadastro_veiculo_recusado -> "Negação";
            case erro_requisicao -> "Erro na Requisição";
            default -> acao.getCodigo();
        };
    }



}
