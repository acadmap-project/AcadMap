package com.acadmap.controller;


import com.acadmap.model.Evento;
import com.acadmap.model.Usuario;
import com.acadmap.model.VeiculoPublicacao;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.model.enums.TipoPerfilUsuario;
import com.acadmap.repository.EventoRepository;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.repository.VeiculoPublicacaoRepository;
import com.acadmap.service.AprovarVeiculoService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/veiculo")
@AllArgsConstructor
public class VeiculoController {

    private UsuarioRepository usuarioRepository;
    private AprovarVeiculoService aprovarVeiculoService;
    private VeiculoPublicacaoRepository veiculoPublicacaoRepository;
    private EventoRepository eventoRepository;


    @PutMapping("/{id}")
    public ResponseEntity<?> aprovaPublicacao(
            @RequestHeader("X-User-Id") UUID idUser,
            @RequestBody VeiculoPublicacao veiculoPublicacao,
            @PathVariable Long id
    ){
        System.out.println("######################");
        System.out.println(idUser);
        System.out.println("######################");
        System.out.println(usuarioRepository.findAll());
        System.out.println(usuarioRepository.findById(idUser).orElseThrow());


        Usuario usuario = usuarioRepository.findById(idUser).orElseThrow();
        if (!usuario.getTipoPerfil().getCodigo().contains(TipoPerfilUsuario.pesquisador.getCodigo())){
            return new ResponseEntity<>(aprovarVeiculoService.exec(usuario, veiculoPublicacao, id), HttpStatus.ACCEPTED) ;
        }
        return new ResponseEntity<>(
                "O usuário não possui permisão para aprovar a publicação",
                HttpStatus.METHOD_NOT_ALLOWED);
    }

    @GetMapping("/pendente")
    public ResponseEntity<?> veiculosPendentes(){

        System.out.println(veiculoPublicacaoRepository.findByStatus(StatusVeiculo.pendente));
        if (veiculoPublicacaoRepository.findByStatus(StatusVeiculo.pendente).isEmpty()){
            return new ResponseEntity<>("Não existem veiculos pendentes na base de dados", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(veiculoPublicacaoRepository.findByStatus(StatusVeiculo.pendente), HttpStatus.OK);
    }




}
