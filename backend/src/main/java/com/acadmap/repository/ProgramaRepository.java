package com.acadmap.repository;

import com.acadmap.model.Programa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProgramaRepository extends JpaRepository<Programa, UUID> {
}
