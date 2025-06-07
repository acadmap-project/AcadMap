package com.acadmap.controller;


import com.acadmap.model.entities.Usuario;
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


    @PutMapping("/aprovar-veiculo/{id}")
    public ResponseEntity<?> aprovaPublicacao(
            @RequestHeader("X-User-Id") UUID idUser,
            @PathVariable("id") UUID idVeiculo
    ){
        Usuario usuario = usuarioRepository.findById(idUser).orElseThrow();
        if (!usuario.getTipoPerfil().getCodigo().contains(TipoPerfilUsuario.pesquisador.getCodigo()) &&
                veiculoPublicacaoRepository.existsByUsuario(usuario)){
            return new ResponseEntity<>(aprovarVeiculoService.aprovar(idVeiculo), HttpStatus.ACCEPTED) ;
        }
        return new ResponseEntity<>(
                ResponseEntity.badRequest().build(),
                HttpStatus.METHOD_NOT_ALLOWED);
    }


    @PutMapping("/negar-veiculo/{id}")
    public ResponseEntity<?> negarPublicacao(
            @RequestHeader("X-User-Id") UUID idUser,
            @PathVariable("id") UUID uuid
    ){
        Usuario usuario = usuarioRepository.findById(idUser).orElseThrow();
        if (!usuario.getTipoPerfil().getCodigo().contains(TipoPerfilUsuario.pesquisador.getCodigo())){
            return new ResponseEntity<>(aprovarVeiculoService.negar(uuid), HttpStatus.ACCEPTED) ;
        }
        return new ResponseEntity<>(
                ResponseEntity.badRequest().build(),
                HttpStatus.METHOD_NOT_ALLOWED);
    }



    @GetMapping("/periodico-pendente")
    public ResponseEntity<?> veiculosPendentes(
            @RequestHeader("X-User-Id") UUID idUser
    ){
        System.out.println(veiculoPublicacaoRepository.findAll());
        if (veiculoPublicacaoRepository.findAll().isEmpty()){
            return new ResponseEntity<>(ResponseEntity.notFound().build(), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(veiculoPublicacaoRepository.findByStatus(StatusVeiculo.pendente), HttpStatus.OK);
    }




}
