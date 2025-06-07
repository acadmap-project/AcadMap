package com.acadmap.controller;


import com.acadmap.model.Usuario;
import com.acadmap.model.VeiculoPublicacao;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.model.enums.TipoPerfilUsuario;
import com.acadmap.repository.EventoRepository;
import com.acadmap.repository.UsuarioRepository;
import com.acadmap.repository.VeiculoPublicacaoRepository;
import com.acadmap.service.AprovarVeiculoService;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/veiculo")
@AllArgsConstructor
public class VeiculoController {

  private UsuarioRepository usuarioRepository;
  private AprovarVeiculoService aprovarVeiculoService;
  private VeiculoPublicacaoRepository veiculoPublicacaoRepository;
  private EventoRepository eventoRepository;


  @PutMapping("/{id}")
  public ResponseEntity<?> aprovaPublicacao(@RequestHeader("X-User-Id") UUID idUser,
      @RequestBody VeiculoPublicacao veiculoPublicacao, @PathVariable UUID id) {
    System.out.println("######################");
    System.out.println(idUser);
    System.out.println("######################");
    System.out.println(this.usuarioRepository.findAll());
    System.out.println(this.usuarioRepository.findById(idUser).orElseThrow());


    Usuario usuario = this.usuarioRepository.findById(idUser).orElseThrow();
    if (!usuario.getTipoPerfil().getCodigo().contains(TipoPerfilUsuario.pesquisador.getCodigo())) {
      return new ResponseEntity<>(this.aprovarVeiculoService.exec(usuario, veiculoPublicacao, id),
          HttpStatus.ACCEPTED);
    }
    return new ResponseEntity<>("O usuário não possui permisão para aprovar a publicação",
        HttpStatus.METHOD_NOT_ALLOWED);
  }

  @GetMapping("/pendente")
  public ResponseEntity<?> veiculosPendentes() {

    System.out.println(this.veiculoPublicacaoRepository.findByStatus(StatusVeiculo.pendente));
    if (this.veiculoPublicacaoRepository.findByStatus(StatusVeiculo.pendente).isEmpty()) {
      return new ResponseEntity<>("Não existem veiculos pendentes na base de dados",
          HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(
        this.veiculoPublicacaoRepository.findByStatus(StatusVeiculo.pendente), HttpStatus.OK);
  }



}
