package com.acadmap.repository;

import com.acadmap.model.AreaPesquisa;

import java.util.List;
import java.util.UUID;

import com.acadmap.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AreaPesquisaRepository extends JpaRepository<AreaPesquisa, UUID> {

}
