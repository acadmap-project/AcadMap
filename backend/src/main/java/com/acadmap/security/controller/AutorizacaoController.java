package com.acadmap.security.controller;


import com.acadmap.security.dto.TokenDTO;
import com.acadmap.security.service.AutorizacaoServiceRsa;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AutorizacaoController {

    @Autowired
    private AutorizacaoServiceRsa autorizacaoServiceRsa;


    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(Authentication authentication){
        return new ResponseEntity<>(autorizacaoServiceRsa.autenticacao(authentication), HttpStatus.ACCEPTED);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> revokeToken(@RequestParam UUID refreshToken) {
        autorizacaoServiceRsa.revokeRefreshToken(refreshToken);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenDTO> refreshToken(
            @RequestParam UUID refreshTokenUUID,
            @RequestHeader("Authorization") String bearerToken
    ) {
        TokenDTO response =
                autorizacaoServiceRsa.refreshToken(refreshTokenUUID, bearerToken);
        return ResponseEntity.ok(response);
    }


}
