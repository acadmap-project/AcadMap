package com.acadmap.repository;

import com.acadmap.model.entities.Programa;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramaRepository extends JpaRepository<Programa, UUID> {

}
