package com.acadmap.model;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "JustificativaRecusa")
public class JustificativaRecusa {

    @Id
    @Column(name = "id_log") // Esta coluna é PK e FK ao mesmo tempo
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // Mapeia o 'id' desta entidade para o 'id' da entidade LogSistema
    @JoinColumn(name = "id_log")
    private LogSistema logSistema;

    @Column(name = "justificativa", length = 1000)
    private String justificativa;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LogSistema getLogSistema() {
        return logSistema;
    }

    public void setLogSistema(LogSistema logSistema) {
        this.logSistema = logSistema;
    }

    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }
}