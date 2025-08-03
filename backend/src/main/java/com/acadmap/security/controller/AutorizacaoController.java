package com.acadmap.security.controller;


import com.acadmap.security.dto.TokenDTO;
import com.acadmap.security.service.AutorizacaoServiceRsa;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AutorizacaoController {

    @Autowired
    private AutorizacaoServiceRsa autorizacaoServiceRsa;


    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(Authentication authentication){
        TokenDTO tokenDTO = new TokenDTO(autorizacaoServiceRsa.autenticacao(authentication));
        return new ResponseEntity<>(tokenDTO, HttpStatus.ACCEPTED);
    }


}
