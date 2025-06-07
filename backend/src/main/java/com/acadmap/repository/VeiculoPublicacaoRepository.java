package com.acadmap.repository;

import com.acadmap.model.VeiculoPublicacao;
import com.acadmap.model.enums.StatusVeiculo;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VeiculoPublicacaoRepository extends JpaRepository<VeiculoPublicacao, UUID> {

  List<VeiculoPublicacao> findByStatus(StatusVeiculo statusPublicacao);

}
