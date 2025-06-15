package com.acadmap.repository;

import com.acadmap.model.entities.LogVeiculo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LogVeiculoRepository extends JpaRepository<LogVeiculo, UUID> {
}
