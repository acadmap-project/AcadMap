package com.acadmap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.acadmap.model.enums.StatusVeiculo;
import org.springframework.stereotype.Repository;
import com.acadmap.model.entities.Evento;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventoRepository extends JpaRepository<Evento, UUID> {

    List<Evento> findByStatus(StatusVeiculo statusVeiculo);

    List<Evento> findByNomeContainingIgnoreCase(String nome);

    List<Evento> findByStatusAndNomeContainingIgnoreCase(StatusVeiculo statusVeiculo, String nome);
}
