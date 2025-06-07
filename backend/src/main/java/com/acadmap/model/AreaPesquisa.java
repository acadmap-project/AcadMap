package com.acadmap.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(of = "idAreaPesquisa")
@EqualsAndHashCode(of = "idAreaPesquisa")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "idAreaPesquisa")

// --- AreaPesquisa ---
@Entity
@Table(name = "areapesquisa")
public class AreaPesquisa {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id_area_pesquisa", columnDefinition = "uuid")
  private UUID idAreaPesquisa;

  @Column(name = "nome", nullable = false, length = 255)
  private String nome;

  @ManyToMany(mappedBy = "areasPesquisa")
  private Set<Usuario> usuarios = new HashSet<>();

  @ManyToMany(mappedBy = "areasPesquisa")
  @JsonManagedReference
  private Set<VeiculoPublicacao> veiculosPublicacao = new HashSet<>();
}
