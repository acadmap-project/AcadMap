package com.acadmap.repository;

import com.acadmap.model.entities.Usuario;
import com.acadmap.model.entities.VeiculoPublicacao;
import com.acadmap.model.enums.StatusVeiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VeiculoPublicacaoRepository extends JpaRepository<VeiculoPublicacao, UUID> {

  List<VeiculoPublicacao> findByStatus(StatusVeiculo statusPublicacao);

  List<VeiculoPublicacao> findByStatusAndUsuarioNot(StatusVeiculo statusVeiculo, Usuario usuario);

  boolean existsByUsuario(Usuario usuario);

  boolean existsByIdVeiculoAndUsuarioIdUsuario(UUID idVeiculo, UUID idUsuario);

  @Query("SELECT v FROM VeiculoPublicacao v JOIN FETCH v.usuario WHERE  v.idVeiculo = :veiculoPublicacaoUuid")
  Optional<VeiculoPublicacao> findAllByFetchVeiculoPublicacaoEagerly(UUID veiculoPublicacaoUuid);

}
