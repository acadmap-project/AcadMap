package com.acadmap.controller;


import com.acadmap.model.dto.VeiculoPublicacaoDTO;
import com.acadmap.model.entities.Usuario;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.model.enums.TipoPerfilUsuario;
import com.acadmap.repository.EventoRepository;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.repository.VeiculoPublicacaoRepository;
import com.acadmap.service.AvaliarVeiculoService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/veiculo")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class VeiculoController {

    private UsuarioRepository usuarioRepository;
    private AvaliarVeiculoService avaliarVeiculoService;
    private VeiculoPublicacaoRepository veiculoPublicacaoRepository;
    private EventoRepository eventoRepository;


    @PutMapping("/aprovar-veiculo/{id}")
    public ResponseEntity<?> aprovaPublicacao(
            @RequestHeader("X-User-Id") UUID idUser,
            @PathVariable("id") UUID idVeiculo
    ){
        if (!this.isPesquisador(idUser) && !this.usuarioVinculadoPublicacao(idVeiculo, idUser)){
            return new ResponseEntity<>(avaliarVeiculoService.aprovar(idVeiculo), HttpStatus.ACCEPTED) ;
        }
        return new ResponseEntity<>(
                ResponseEntity.badRequest().build(),
                HttpStatus.METHOD_NOT_ALLOWED);
    }


    @PutMapping("/negar-veiculo/{id}")
    public ResponseEntity<?> negarPublicacao(
            @RequestHeader("X-User-Id") UUID idUser,
            @PathVariable("id") UUID idVeiculo
    ){
        if (!this.isPesquisador(idUser) && !this.usuarioVinculadoPublicacao(idVeiculo, idUser)){
            return new ResponseEntity<>(avaliarVeiculoService.negar(idVeiculo), HttpStatus.ACCEPTED) ;
        }
        return new ResponseEntity<>(
                ResponseEntity.badRequest().build(),
                HttpStatus.METHOD_NOT_ALLOWED);
    }



    @GetMapping("/periodico-pendente")
    public ResponseEntity<?> veiculosPendentes(
            @RequestHeader("X-User-Id") UUID idUser
    ){
        usuarioRepository.findByAllAndFetchProgramaEagerly();
        if (veiculoPublicacaoRepository.findAll().isEmpty()){
            return new ResponseEntity<>(ResponseEntity.notFound().build(), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(this.getVeiculosPendentes(), HttpStatus.OK);
    }


    private boolean isPesquisador(UUID idUser){
        Usuario usuario = usuarioRepository.findById(idUser).orElseThrow(EntityNotFoundException::new);
        return usuario.getTipoPerfil().getCodigo().contains(TipoPerfilUsuario.pesquisador.getCodigo());
    }

    private boolean usuarioVinculadoPublicacao(UUID idVeiculo, UUID idUsuario){
        boolean teste = veiculoPublicacaoRepository.existsByIdVeiculoAndUsuarioIdUsuario(idVeiculo, idUsuario);
        return teste;
    }

    private List<VeiculoPublicacaoDTO> getVeiculosPendentes(){
        return veiculoPublicacaoRepository.findByStatus(StatusVeiculo.pendente)
                .stream().map(VeiculoPublicacaoDTO::new).toList();
    }


}
