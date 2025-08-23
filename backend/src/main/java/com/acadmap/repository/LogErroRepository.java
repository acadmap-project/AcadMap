package com.acadmap.repository;

import com.acadmap.model.entities.LogErro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LogErroRepository extends JpaRepository<LogErro, UUID> {
}
