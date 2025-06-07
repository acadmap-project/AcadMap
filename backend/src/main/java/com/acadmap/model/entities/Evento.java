package com.acadmap.model.entities;

import com.acadmap.model.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(of = "idVeiculo")
@EqualsAndHashCode(of = "idVeiculo")

// --- Evento (Subclasse de VeiculoPublicacao) ---
@Entity
@Table(name = "evento")
@PrimaryKeyJoinColumn(name = "id_veiculo")
public class Evento extends VeiculoPublicacao {

  @Column(name = "h5", nullable = false)
  private Integer h5;

  @Column(name = "link_evento", nullable = false, length = 255)
  private String linkEvento;

  @Column(name = "link_google_scholar", length = 255)
  private String linkGoogleScholar;

  @Column(name = "link_sol_sbc", length = 255)
  private String linkSolSbc;

}
