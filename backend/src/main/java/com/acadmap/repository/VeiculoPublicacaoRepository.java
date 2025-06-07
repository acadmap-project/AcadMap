package com.acadmap.repository;

import com.acadmap.model.entities.VeiculoPublicacao;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.model.enums.TipoPerfilUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VeiculoPublicacaoRepository extends JpaRepository<VeiculoPublicacao, UUID> {

  List<VeiculoPublicacao> findByStatus(StatusVeiculo statusPublicacao);

}
