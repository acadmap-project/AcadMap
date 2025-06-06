package com.acadmap.service;


import com.acadmap.model.Evento;
import com.acadmap.model.Usuario;
import com.acadmap.model.VeiculoPublicacao;
import com.acadmap.model.enums.ClassificacaoVeiculo;
import com.acadmap.repository.EventoRepository;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.repository.VeiculoPublicacaoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class AprovarVeiculoService {

    private UsuarioRepository usuarioRepository;
    private EventoRepository eventoRepository;
    private VeiculoPublicacaoRepository veiculoPublicacaoRepository;


    public VeiculoPublicacao exec(VeiculoPublicacao veiculoPublicacaoAtualizado){


        VeiculoPublicacao veiculoPublicacaoAtual = veiculoPublicacaoRepository.findById(veiculoPublicacaoAtualizado.getIdVeiculo()).orElseThrow();

        veiculoPublicacaoAtual.setStatus(veiculoPublicacaoAtualizado.getStatus());

        veiculoPublicacaoRepository.save(veiculoPublicacaoAtual);

        return veiculoPublicacaoAtual;
    }
}
