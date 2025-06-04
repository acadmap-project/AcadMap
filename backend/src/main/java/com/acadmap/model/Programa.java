package com.acadmap.model;
import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Programa")
public class Programa {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_programa")
    private UUID id;

    @Column(name = "nome", length = 255)
    private String nome;

    @OneToMany(mappedBy = "programa")
    private List<Usuario> usuarios;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<Usuario> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(List<Usuario> usuarios) {
        this.usuarios = usuarios;
    }
}
