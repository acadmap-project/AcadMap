package com.acadmap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.acadmap.model.entities.Evento;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventoRepository extends JpaRepository<Evento, UUID> {


  List<Evento> findByNomeContainingIgnoreCase(String nome);
}
