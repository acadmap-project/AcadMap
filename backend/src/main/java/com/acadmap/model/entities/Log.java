package com.acadmap.model.entities;

import com.acadmap.model.enums.AcaoLog;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(of = "idLog")
@EqualsAndHashCode(of = "idLog")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "idLog")
// --- Log (Superclasse) ---
@Entity
@Table(name = "log")
@Inheritance(strategy = InheritanceType.JOINED)
public class Log {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id_log", columnDefinition = "uuid")
  private UUID idLog;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_usuario")
  private Usuario usuario;

  @Column(name = "data_hora", nullable = false)
  private LocalDateTime dataHora;

  @Enumerated(EnumType.STRING)
  @Column(name = "acao", nullable = false, length = 30)
  private AcaoLog acao;
}
