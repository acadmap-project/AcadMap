package com.acadmap.repository;

import com.acadmap.model.entities.AreaPesquisa;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AreaPesquisaRepository extends JpaRepository<AreaPesquisa, UUID> {

}
