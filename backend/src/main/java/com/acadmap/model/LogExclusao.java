package com.acadmap.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@ToString(of="idLog")
@EqualsAndHashCode(of="idLog")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "idLog")
// --- LogExclusao (Subclasse de Log) ---
@Entity
@Table(name = "logexclusao")
@PrimaryKeyJoinColumn(name = "id_log")
public class LogExclusao extends Log {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_excluido")
    private Usuario usuarioExcluido;

}
