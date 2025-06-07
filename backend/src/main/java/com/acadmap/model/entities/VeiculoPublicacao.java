package com.acadmap.model.entities;

import com.acadmap.model.enums.*;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(of = "idVeiculo")
@EqualsAndHashCode(of = "idVeiculo")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "idVeiculo")

// --- VeiculoPublicacao (Superclasse Abstrata) ---
@Entity
@Table(name = "veiculopublicacao")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class VeiculoPublicacao {

  @Id
  @Column(name = "id_veiculo", columnDefinition = "uuid")
  private UUID idVeiculo;

  @Column(name = "nome", nullable = false, length = 255)
  private String nome;

  @Enumerated(EnumType.STRING)
  @Column(name = "classificacao", nullable = false, length = 2)
  private ClassificacaoVeiculo classificacao;

  @Enumerated(EnumType.STRING)
  @Column(name = "vinculo_sbc", nullable = false, length = 20)
  private VinculoSBC vinculoSbc;

  @Enumerated(EnumType.STRING)
  @Column(name = "adequado_defesa", nullable = false, length = 20)
  private AdequacaoDefesa adequadoDefesa;

  @Enumerated(EnumType.STRING)
  @Column(name = "tipo", nullable = false, length = 10)
  private TipoVeiculo tipo;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", length = 10)
  @ColumnDefault("PENDENTE")
  private StatusVeiculo status;

  @ManyToMany
  @JoinTable(name = "areapesquisaveiculo", joinColumns = @JoinColumn(name = "id_veiculo"),
      inverseJoinColumns = @JoinColumn(name = "id_area_pesquisa"))
  private Set<AreaPesquisa> areasPesquisa = new HashSet<>();

  @OneToMany(mappedBy = "veiculo", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<LogVeiculo> logsVeiculo = new HashSet<>();
}
