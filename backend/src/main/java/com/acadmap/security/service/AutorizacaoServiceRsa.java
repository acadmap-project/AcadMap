package com.acadmap.security.service;

import com.acadmap.security.provider.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AutorizacaoServiceRsa {

    private final JwtService jwtService;

    public  String autenticacao(Authentication authentication){
        return jwtService.generateToken(authentication);
    }

}
