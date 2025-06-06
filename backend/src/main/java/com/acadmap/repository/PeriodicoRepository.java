package com.acadmap.repository;

import com.acadmap.model.Evento;
import com.acadmap.model.Periodico;
import com.acadmap.model.enums.StatusVeiculo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PeriodicoRepository extends JpaRepository<Periodico, UUID> {

    List<Periodico> findByStatus(StatusVeiculo statusVeiculo);

}
