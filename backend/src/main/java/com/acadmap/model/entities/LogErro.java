package com.acadmap.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "log_erro")
@PrimaryKeyJoinColumn(name = "id_log") // Relaciona a PK de LogErro com a PK de Log
public class LogErro extends Log {

    @Column(name = "descricao_erro", length = 1000)
    private String descricaoErro;
}
