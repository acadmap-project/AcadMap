package com.acadmap.repository;

import com.acadmap.model.entities.Log;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import com.acadmap.model.enums.AcaoLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends JpaRepository<Log, UUID> {

    List<Log> findByAcaoIn(Collection<AcaoLog> acoes);
}
