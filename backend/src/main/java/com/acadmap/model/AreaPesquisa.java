package com.acadmap.model;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
@ToString(of="idAreaPesquisa")
@EqualsAndHashCode(of="idAreaPesquisa")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
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
