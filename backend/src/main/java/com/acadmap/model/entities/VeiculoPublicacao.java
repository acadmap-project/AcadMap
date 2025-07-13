package com.acadmap.model.entities;

import com.acadmap.model.enums.*;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.HashSet;
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
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "tipo")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Evento.class, name = "evento"),
        @JsonSubTypes.Type(value = Periodico.class, name = "periodico")
})
//@JsonDeserialize(as = Periodico.class)
public abstract class VeiculoPublicacao {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id_veiculo", columnDefinition = "uuid")
  private UUID idVeiculo;

  @Column(name = "nome", nullable = false, length = 255)
  private String nome;

  @Column(name = "h5")
  private Integer h5;

  @Column(name = "link_google_scholar", length = 255)
  private String linkGoogleScholar;

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
  @ColumnDefault("pendente")
  private StatusVeiculo status;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_usuario", nullable = false)
  private Usuario usuario;

  @ManyToMany
  @JoinTable(name = "areapesquisaveiculo", joinColumns = @JoinColumn(name = "id_veiculo"),
      inverseJoinColumns = @JoinColumn(name = "id_area_pesquisa"))
  private Set<AreaPesquisa> areasPesquisa = new HashSet<>();
  @OneToMany(mappedBy = "veiculo", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<LogVeiculo> logsVeiculo = new HashSet<>();

  // Default implementation returns null, overridden in Evento subclass
  public String getLinkEvento() {
    return null;
  }
}
