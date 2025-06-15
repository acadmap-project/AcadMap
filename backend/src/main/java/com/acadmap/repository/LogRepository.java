package com.acadmap.repository;

import com.acadmap.model.entities.Log;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends JpaRepository<Log, UUID> {

}
