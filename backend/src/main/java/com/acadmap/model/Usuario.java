package com.acadmap.model;
import com.acadmap.model.enums.TipoPerfilUsuario;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.*;

@Getter
@Setter
@AllArgsConstructor
@ToString(of="idUsuario")
@EqualsAndHashCode(of="idUsuario")
// --- Usuario ---
@Entity
@Table(name = "Usuario")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "idUsuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_usuario", columnDefinition = "uuid")
    private UUID idUsuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_programa", nullable = false)
    private Programa programa;

    @Column(name = "nome", nullable = false, length = 255)
    private String nome;

    @Column(name = "email", nullable = false, length = 255, unique = true)
    private String email;

    @Column(name = "senha", nullable = false, length = 255)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_perfil", nullable = false, length = 20)
    private TipoPerfilUsuario tipoPerfil;

    @Column(name = "flag_ativo")
    @ColumnDefault("true")
    private Boolean flagAtivo = true;

    @ManyToMany
    @JoinTable(
            name = "AreaPesquisaUsuario",
            joinColumns = @JoinColumn(name = "id_usuario"),
            inverseJoinColumns = @JoinColumn(name = "id_area_pesquisa")
    )
    private Set<AreaPesquisa> areasPesquisa = new HashSet<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private Set<Log> logs = new HashSet<>();

    @OneToMany(mappedBy = "usuarioExcluido", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private Set<LogExclusao> logsExclusaoUsuario = new HashSet<>();
}