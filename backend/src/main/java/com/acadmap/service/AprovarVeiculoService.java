package com.acadmap.service;


import com.acadmap.model.Usuario;
import com.acadmap.model.VeiculoPublicacao;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.repository.VeiculoPublicacaoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AprovarVeiculoService {

    private UsuarioRepository usuarioRepository;
    private VeiculoPublicacaoRepository veiculoPublicacaoRepository;


    public VeiculoPublicacao exec(Usuario usuarioPublicador, VeiculoPublicacao veiculoPublicacaoAtualizado, Long id){

        VeiculoPublicacao veiculoPublicacaoAtual = veiculoPublicacaoRepository.findById(id).orElseThrow();

        veiculoPublicacaoAtual.setStatus(veiculoPublicacaoAtualizado.getStatus());

        veiculoPublicacaoRepository.save(veiculoPublicacaoAtual);

        return veiculoPublicacaoAtual;
    }
}
