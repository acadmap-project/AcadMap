package com.acadmap.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@ToString(of="idPrograma")
@EqualsAndHashCode(of="idPrograma")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "idPrograma")

// --- Programa ---
@Entity
@Table(name = "programa")
public class Programa {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_programa", columnDefinition = "uuid")
    private UUID idPrograma;

    @Column(name = "nome", nullable = false, length = 255)
    private String nome;

    @OneToMany(mappedBy = "programa", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private Set<Usuario> usuarios = new HashSet<>();

    // Construtor Padrão
    public Programa() {
    }
}