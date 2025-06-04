package com.acadmap.model;
import com.acadmap.model.enums.TipoAcao;
import jakarta.persistence.*;
import java.time.LocalDateTime; // Ou LocalDateTime se 'data_hora' incluir tempo
import java.util.UUID;

@Entity
@Table(name = "LogSistema")
public class LogSistema {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_log")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_veiculo", nullable = false)
    private VeiculoPublicacao veiculoPublicacao;

    // O DDL especifica 'date'. Se for realmente apenas data, LocalDate é bom.
    // Se precisar de data e hora, o DDL deveria ser TIMESTAMP e aqui LocalDateTime.
    // Assumindo que 'data_hora' no nome implica que hora é relevante,
    // e que o DDL 'date' pode ser um engano ou simplificação.
    // Se for estritamente 'date', use LocalDate.
    // @Column(name = "data_hora", nullable = false)
    // private LocalDate dataHora;
    // Vou usar LocalDateTime assumindo que o nome "data_hora" é mais indicativo
    @Column(name = "data_hora", nullable = false)
    private java.time.LocalDateTime dataHora;


    @Enumerated(EnumType.STRING)
    @Column(name = "acao", nullable = false, columnDefinition = "tipo_acao")
    private TipoAcao acao;

    @OneToOne(mappedBy = "logSistema", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private JustificativaRecusa justificativaRecusa;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public VeiculoPublicacao getVeiculoPublicacao() {
        return veiculoPublicacao;
    }

    public void setVeiculoPublicacao(VeiculoPublicacao veiculoPublicacao) {
        this.veiculoPublicacao = veiculoPublicacao;
    }

    public java.time.LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(java.time.LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public TipoAcao getAcao() {
        return acao;
    }

    public void setAcao(TipoAcao acao) {
        this.acao = acao;
    }

    public JustificativaRecusa getJustificativaRecusa() {
        return justificativaRecusa;
    }

    public void setJustificativaRecusa(JustificativaRecusa justificativaRecusa) {
        this.justificativaRecusa = justificativaRecusa;
        if (justificativaRecusa != null) {
            justificativaRecusa.setLogSistema(this);
        }
    }
}
