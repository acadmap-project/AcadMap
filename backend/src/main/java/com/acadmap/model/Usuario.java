package com.acadmap.model;
import com.acadmap.model.enums.TipoUsuario;
import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_usuario")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_area_pesquisa", nullable = false)
    private AreaPesquisa areaPesquisa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_programa", nullable = false)
    private Programa programa;

    @Column(name = "nome", length = 255, nullable = false)
    private String nome;

    @Column(name = "email", length = 255, unique = true, nullable = false)
    private String email;

    @Column(name = "senha", length = 255, nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_perfil", nullable = false, columnDefinition = "tipo_usuario")
    private TipoUsuario tipoPerfil;

    @OneToMany(mappedBy = "usuario")
    private List<LogSistema> logs;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public AreaPesquisa getAreaPesquisa() {
        return areaPesquisa;
    }

    public void setAreaPesquisa(AreaPesquisa areaPesquisa) {
        this.areaPesquisa = areaPesquisa;
    }

    public Programa getPrograma() {
        return programa;
    }

    public void setPrograma(Programa programa) {
        this.programa = programa;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public TipoUsuario getTipoPerfil() {
        return tipoPerfil;
    }

    public void setTipoPerfil(TipoUsuario tipoPerfil) {
        this.tipoPerfil = tipoPerfil;
    }

    public List<LogSistema> getLogs() {
        return logs;
    }

    public void setLogs(List<LogSistema> logs) {
        this.logs = logs;
    }
}


