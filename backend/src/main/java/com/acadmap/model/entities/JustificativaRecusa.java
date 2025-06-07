package com.acadmap.model.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import java.util.Objects;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
@ToString(of = "idLog")
@EqualsAndHashCode(of = "idLog")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "idLog")
// --- JustificativaRecusa ---
@Entity
@Table(name = "justificativarecusa")
public class JustificativaRecusa {

  @Id
  @Column(name = "id_log", columnDefinition = "uuid")
  private UUID idLog;

  @OneToOne(fetch = FetchType.LAZY)
  @MapsId
  @JoinColumn(name = "id_log")
  private LogVeiculo logVeiculo;

  @Column(name = "justificativa", nullable = false, length = 1000)
  private String justificativa;

  // Construtores, Getters, Setters, Equals, HashCode, ToString
}
