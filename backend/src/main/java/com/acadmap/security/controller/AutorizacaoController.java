package com.acadmap.security.controller;


import com.acadmap.security.dto.AutorizacaoResponseDTO;
import com.acadmap.security.dto.LoginDTO;
import com.acadmap.security.service.AutorizacaoService;
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

//    @Autowired
//    private AutorizacaoService autorizacaoService;

    @Autowired
    private AutorizacaoServiceRsa autorizacaoServiceRsa;


    @PostMapping("/login")
    public ResponseEntity<String> login(Authentication authentication){
//        String token = autorizacaoService.login(loginDTO);
//
//        AutorizacaoResponseDTO autorizacaoResponseDTO = new AutorizacaoResponseDTO();
//        autorizacaoResponseDTO.setTokenAcesso(token);
//
//        return new ResponseEntity<>(autorizacaoResponseDTO, HttpStatus.OK);
        return new ResponseEntity<>(autorizacaoServiceRsa.autenticacao(authentication), HttpStatus.ACCEPTED);

    }


}
