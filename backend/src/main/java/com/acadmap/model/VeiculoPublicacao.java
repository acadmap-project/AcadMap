package com.acadmap.model;


import com.acadmap.model.enums.StatusPublicacao;
import com.acadmap.model.enums.TipoPerfil;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@Table(name = "VEICULO_PUBLICACAO")
@DynamicUpdate
@DynamicInsert
@ToString(of = "id")
@AllArgsConstructor
@NoArgsConstructor
public class VeiculoPublicacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column
    private String nome;

    @Column
    @Enumerated(EnumType.STRING)
    private StatusPublicacao statusPublicacao;

}
