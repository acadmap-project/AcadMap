package com.acadmap.model.entities;

import com.acadmap.model.enums.AcaoLog;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@ToString(of = "idLog")
@EqualsAndHashCode(of = "idLog")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "idLog")

// --- LogVeiculo (Subclasse de Log) ---
@Entity
@NoArgsConstructor
@Table(name = "logveiculo")
@PrimaryKeyJoinColumn(name = "id_log")
public class LogVeiculo extends Log {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_veiculo")
  private VeiculoPublicacao veiculo;

  @OneToOne(mappedBy = "logVeiculo", cascade = CascadeType.ALL, fetch = FetchType.LAZY,
      orphanRemoval = true)
  private JustificativaRecusa justificativaRecusa;

}
