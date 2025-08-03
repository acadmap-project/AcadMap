package com.acadmap.security.controller;


import com.acadmap.security.dto.RefreshTokenDTO;
import com.acadmap.security.dto.TokenDTO;
import com.acadmap.security.service.AutorizacaoServiceRsa;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AutorizacaoController {

    @Autowired
    private AutorizacaoServiceRsa autorizacaoServiceRsa;


    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(Authentication authentication){
        return new ResponseEntity<>(autorizacaoServiceRsa.autenticacao(authentication), HttpStatus.ACCEPTED);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenDTO> refreshToken(
            @RequestParam UUID refreshTokenUUID,
            @RequestHeader("Authorization") String bearerToken
    ) {
        RefreshTokenDTO response =
                autorizacaoServiceRsa.refreshToken(refreshTokenUUID, bearerToken);
        return ResponseEntity.ok(response);
    }


}
