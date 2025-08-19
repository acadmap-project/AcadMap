package com.acadmap.controller;


import com.acadmap.exception.pesquisador.PesquisadorUnauthorizedException;
import com.acadmap.exception.veiculo.VeiculoVinculadoException;
import com.acadmap.model.dto.periodico.ClassificacaoPeriodicoRequestDTO;
import com.acadmap.model.dto.veiculo.VeiculoPublicacaoDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
            @PathVariable("id") UUID idVeiculo,
            @RequestBody ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO
    ){
        if (this.isPesquisador(idUser)){
            throw new PesquisadorUnauthorizedException(
                    "Pesquisador não possui permissão para aprovar um veiculo",
                    veiculoPublicacaoRepository.findById(idVeiculo).orElseThrow(EntityNotFoundException::new));
        }
        else if(this.usuarioVinculadoPublicacao(idVeiculo, idUser)){
            throw new VeiculoVinculadoException(
                    "O usuario está vinculado ao veiculo de publicação, não é possível aprova-lo",
                    veiculoPublicacaoRepository.findById(idVeiculo).orElseThrow(EntityNotFoundException::new));
        }
        return new ResponseEntity<>(avaliarVeiculoService.aceito(idVeiculo, classificacaoPeriodicoRequestDTO, idUser), HttpStatus.ACCEPTED);
    }


    @PutMapping("/negar-veiculo/{id}")
    public ResponseEntity<?> negarPublicacao(
            @RequestHeader("X-User-Id") UUID idUser,
            @PathVariable("id") UUID idVeiculo,
            @RequestBody ClassificacaoPeriodicoRequestDTO classificacaoPeriodicoRequestDTO

    ){
        if (this.isPesquisador(idUser)){
            throw new PesquisadorUnauthorizedException(
                    "Pesquisador não possui permissão para negar um veiculo",
                    veiculoPublicacaoRepository.findById(idVeiculo).orElseThrow(EntityNotFoundException::new));
        }
        else if(this.usuarioVinculadoPublicacao(idVeiculo, idUser)){
            throw new VeiculoVinculadoException(
                    "O usuario está vinculado ao veiculo de publicação, não é possível nega-lo",
                    veiculoPublicacaoRepository.findById(idVeiculo).orElseThrow(EntityNotFoundException::new));
        }
        return new ResponseEntity<>(avaliarVeiculoService.negar(idVeiculo, classificacaoPeriodicoRequestDTO, idUser), HttpStatus.ACCEPTED);
    }



    @GetMapping("/periodico-pendente")
    public ResponseEntity<?> veiculosPendentes(
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
