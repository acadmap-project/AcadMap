package com.acadmap.model.entities;

import com.acadmap.model.enums.*;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(of = "idVeiculo")
@EqualsAndHashCode(of = "idVeiculo")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "idVeiculo")

// --- Periodico (Subclasse de VeiculoPublicacao) ---
@Entity
@Table(name = "periodico")
@PrimaryKeyJoinColumn(name = "id_veiculo")
public class Periodico extends VeiculoPublicacao {

  @Column(name = "ISSN", nullable = false, length = 8, unique = true)
  private String issn;

  @Column(name = "percentil_jcr")
  private Integer percentilJcr;

  @Column(name = "percentil_scopus")
  private Integer percentilScopus;

  @Column(name = "link_jcr", length = 255)
  private String linkJcr;

  @Column(name = "link_scopus", length = 255)
  private String linkScopus;

  @Column(name = "link_google_scholar", length = 255)
  private String linkGoogleScholar;

  @Enumerated(EnumType.STRING)
  @Column(name = "qualis_antigo", length = 2)
  private QualisAntigo qualisAntigo;

  @Column(name = "flag_predatorio")
  @ColumnDefault("false")
  private Boolean flagPredatorio = false;
}
