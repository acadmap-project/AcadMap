package com.acadmap.security.service;

import com.acadmap.security.dto.LoginDTO;
import com.acadmap.security.provider.JwtService;
import com.acadmap.security.provider.JwtTokenProvider;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AutorizacaoServiceImpl implements AutorizacaoService{

//    private final AuthenticationManager authenticationManager;
//    private final JwtTokenProvider jwtTokenProvider;
    private final JwtService jwtService;

    @Override
    public String login(LoginDTO loginDTO) {

//        Authentication autenticacao = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
//                loginDTO.getNome(),
//                loginDTO.getSenha()
//        ));


//        SecurityContextHolder.getContext().setAuthentication(autenticacao);
//
////        return jwtTokenProvider.generateToken(autenticacao);
//        return jwtService.generateToken(autenticacao);
        return "";
    }

}
