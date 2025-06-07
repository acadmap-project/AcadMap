package com.acadmap.service;

import com.acadmap.model.entities.Log;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.AcaoLog;
import com.acadmap.repository.LogRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogService {
  private final LogRepository logRepository;

  @Transactional
  public void registraCadastroUsuario(Usuario usuario) {
    Log log = new Log();
    log.setUsuario(usuario);
    log.setDataHora(LocalDateTime.now());
    log.setAcao(AcaoLog.cadastro_usuario);
    this.logRepository.save(log);
  }

}
