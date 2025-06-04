package com.acadmap.repository;

import com.acadmap.model.AreaPesquisa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AreaPesquisaRepository extends JpaRepository<AreaPesquisa, UUID> {
}
