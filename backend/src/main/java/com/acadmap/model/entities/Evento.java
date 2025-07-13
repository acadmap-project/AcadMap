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

  @Column(name = "link_sol_sbc", length = 255)
  private String linkSolSbc;

  @Override
  public String getLinkEvento() {
    return super.getLinkGoogleScholar();
  }

}
