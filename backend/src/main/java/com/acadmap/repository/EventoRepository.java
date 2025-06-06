package com.acadmap.repository;

import com.acadmap.model.Evento;
import com.acadmap.model.VeiculoPublicacao;
import com.acadmap.model.enums.StatusVeiculo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventoRepository extends JpaRepository<Evento, UUID> {

    List<Evento> findByStatus(StatusVeiculo statusVeiculo);

}
