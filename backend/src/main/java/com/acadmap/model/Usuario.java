package com.acadmap.model;


import com.acadmap.model.enums.TipoPerfil;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@Table(name = "USUARIO")
@DynamicUpdate
@DynamicInsert
@ToString(of = "id")
@AllArgsConstructor
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String nome;


    @Column
    @Enumerated(EnumType.STRING)
    private TipoPerfil tipoPerfil;

}
