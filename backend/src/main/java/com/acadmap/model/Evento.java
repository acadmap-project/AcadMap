package com.acadmap.model;
import jakarta.persistence.*;

@Entity
@Table(name = "Evento")
@PrimaryKeyJoinColumn(name = "id_veiculo") // Referencia a PK da superclasse
public class Evento extends VeiculoPublicacao {

    // id_veiculo é herdado de VeiculoPublicacao e é a PK aqui

    @Column(name = "h5", nullable = false)
    private int h5;

    @Column(name = "link_evento", length = 255, nullable = false)
    private String linkEvento;

    @Column(name = "link_google_scholar", length = 255)
    private String linkGoogleScholar;

    @Column(name = "link_sol_sbc", length = 255)
    private String linkSolSbc;

    // Getters and Setters
    public int getH5() {
        return h5;
    }

    public void setH5(int h5) {
        this.h5 = h5;
    }

    public String getLinkEvento() {
        return linkEvento;
    }

    public void setLinkEvento(String linkEvento) {
        this.linkEvento = linkEvento;
    }

    public String getLinkGoogleScholar() {
        return linkGoogleScholar;
    }

    public void setLinkGoogleScholar(String linkGoogleScholar) {
        this.linkGoogleScholar = linkGoogleScholar;
    }

    public String getLinkSolSbc() {
        return linkSolSbc;
    }

    public void setLinkSolSbc(String linkSolSbc) {
        this.linkSolSbc = linkSolSbc;
    }
}
