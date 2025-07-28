package com.acadmap.security.provider;

import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.SecureRandom;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private String jwtSecret = "af60addca9ea3e3c099551e1b6576c9966dce0a33de879dd7e160f86dbd872ca236d6e9ee66fb6e30039fe7c345324a10f3d0741b0600fa7a45df4c6691eff4f4209767ed39f51e37717d8feecd5dd14fc34ebe619e6a29ae91d9ffe134cb5718bec0b3680d6ae7fc09e67763fe7c05d05d3ba69f47211163852633755b7f861132b0c98f8d7c1af9152d547408e676867a0a32fb525a4354180f5fb6b2dc23b5faa4155b8db63385f96259a90b6ee0e74a5b90a4f0f4fa96fafc296c64588b5c009b3829ae2e1d69a1cf7569b50a65fa553350495d18816f785f961c970c0a9cb9c8da25cc5e9fa4a3e9527a132d616b232d1ee21c3bf6dc8d9e3376e2e82c0";


    public String generateToken(Authentication authentication){
        long jwtExpitaracaoData = 3600000;

        String nome = authentication.getName();
        Date dataAtual = new Date();
        Date dataExpiracao = new Date(dataAtual.getTime() + jwtExpitaracaoData);


        return Jwts.builder()
                .subject(nome)
                .issuedAt(dataAtual)
                .expiration(dataExpiracao)
                .signWith(key())
                .compact();
    }

    private SecretKey key(){
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String getUsername(String token){
        JwtParser parserJwt = Jwts.parser()
                .verifyWith(key()).build();

        return parserJwt
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token){
        Jwt<?, ?> parserJwt = Jwts.parser()
                .verifyWith(key()).build().parse(token);
        return true;
    }

}
