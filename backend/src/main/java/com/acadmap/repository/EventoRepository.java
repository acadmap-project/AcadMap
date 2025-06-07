package com.acadmap.repository;

import com.acadmap.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventoRepository extends JpaRepository<Evento, UUID> {


    List<Evento> findByNomeContainingIgnoreCase(String nome);
}
