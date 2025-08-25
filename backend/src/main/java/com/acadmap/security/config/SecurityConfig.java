package com.acadmap.security.config;


import com.acadmap.security.error.JwtAutenticacaoEntryPoint;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.proc.SecurityContext;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Component
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${jwt.public.key}")
    private RSAPublicKey pubKey;


    @Value("${jwt.private.key}")
    private RSAPrivateKey privKey;

    @Autowired
    private JwtAutenticacaoEntryPoint jwtAutenticacaoEntryPoint;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> {
                    authorize.requestMatchers("/api/auth/login").permitAll();
                    authorize.requestMatchers("/api/auth/logout").permitAll();
                    authorize.requestMatchers("/api/usuario/cadastro").permitAll();
                    authorize.requestMatchers("/api/periodicos/listar").permitAll();
                    authorize.requestMatchers("/api/periodicos/*").permitAll();
                    authorize.requestMatchers("/api/eventos/listar").permitAll();
                    authorize.requestMatchers("/api/eventos/*").permitAll();
                    authorize.requestMatchers("api/areas/listar").permitAll();
                    authorize.requestMatchers("api/programa/listar").permitAll();
                    authorize.requestMatchers("api/log-erro/adicionar").permitAll();
                    authorize.requestMatchers("api/log/adicionar").permitAll();
                    authorize.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                    authorize.anyRequest().authenticated();
                }).httpBasic(Customizer.withDefaults())
                .oauth2ResourceServer(conf ->
                        conf.jwt(Customizer.withDefaults()));

        httpSecurity.exceptionHandling(exception ->
                exception.authenticationEntryPoint(jwtAutenticacaoEntryPoint)
                );


        return httpSecurity.build();
    }

    @Bean
    public JwtDecoder jwtDecoder(){
        return NimbusJwtDecoder.withPublicKey(pubKey).build();
    }

    @Bean
    public JwtEncoder jwtEncoder(){
        RSAKey jwk = new RSAKey.Builder(pubKey).privateKey(privKey).build();
        var immutableJWKSet = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(immutableJWKSet);
    }


}
