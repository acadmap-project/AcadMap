package com.acadmap.repository;

import com.acadmap.model.Usuario;
import com.acadmap.model.VeiculoPublicacao;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.model.enums.TipoPerfilUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VeiculoPublicacaoRepository extends JpaRepository<VeiculoPublicacao, Long> {

    List<VeiculoPublicacao> findByStatus(StatusVeiculo statusPublicacao);

}
