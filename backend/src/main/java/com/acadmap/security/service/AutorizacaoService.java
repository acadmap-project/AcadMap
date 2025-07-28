package com.acadmap.security.service;

import com.acadmap.security.dto.LoginDTO;
import org.springframework.stereotype.Service;

public interface AutorizacaoService {
    String login(LoginDTO loginDTO);
}
