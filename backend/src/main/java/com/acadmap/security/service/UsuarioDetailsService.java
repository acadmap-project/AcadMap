package com.acadmap.security.service;


import com.acadmap.model.entities.Usuario;
import com.acadmap.repository.UsuarioRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;

@Data
@Service
public class UsuarioDetailsService implements UserDetailsService {

    @Autowired
    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String nome) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(nome).orElseThrow();

        Set<GrantedAuthority> authorities = Set.of(new SimpleGrantedAuthority(usuario.getTipoPerfil().getCodigo()));

        return new User(
                nome,
                usuario.getSenha(),
                authorities
        );
    }

}
