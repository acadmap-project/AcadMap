package com.acadmap.repository;

import com.acadmap.model.entities.JustificativaRecusa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface JustificativaRecusaRepository extends JpaRepository<JustificativaRecusa, UUID> {
}
