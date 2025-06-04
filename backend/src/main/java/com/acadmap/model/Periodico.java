package com.acadmap.model;
import com.acadmap.model.enums.TipoQualisAntigo;
import jakarta.persistence.*;

@Entity
@Table(name = "Periodico")
@PrimaryKeyJoinColumn(name = "id_veiculo") // Referencia a PK da superclasse
public class Periodico extends VeiculoPublicacao {

    // id_veiculo é herdado de VeiculoPublicacao e é a PK aqui

    @Column(name = "ISSN", length = 8, unique = true, nullable = false)
    private String issn;

    @Column(name = "percentil", nullable = false)
    private int percentil;

    @Column(name = "link_jcr", length = 255)
    private String linkJcr;

    @Column(name = "link_scopus", length = 255)
    private String linkScopus;

    @Column(name = "link_google_scholar", length = 255)
    private String linkGoogleScholar; // default null é implícito

    @Enumerated(EnumType.STRING)
    @Column(name = "qualis_antigo", columnDefinition = "tipo_qualis_antigo default null")
    private TipoQualisAntigo qualisAntigo;

    @Column(name = "flag_predatorio", columnDefinition = "boolean default false")
    private boolean flagPredatorio = false; // Valor padrão Java

    // Getters and Setters
    public String getIssn() {
        return issn;
    }

    public void setIssn(String issn) {
        this.issn = issn;
    }

    public int getPercentil() {
        return percentil;
    }

    public void setPercentil(int percentil) {
        this.percentil = percentil;
    }

    public String getLinkJcr() {
        return linkJcr;
    }

    public void setLinkJcr(String linkJcr) {
        this.linkJcr = linkJcr;
    }

    public String getLinkScopus() {
        return linkScopus;
    }

    public void setLinkScopus(String linkScopus) {
        this.linkScopus = linkScopus;
    }

    public String getLinkGoogleScholar() {
        return linkGoogleScholar;
    }

    public void setLinkGoogleScholar(String linkGoogleScholar) {
        this.linkGoogleScholar = linkGoogleScholar;
    }

    public TipoQualisAntigo getQualisAntigo() {
        return qualisAntigo;
    }

    public void setQualisAntigo(TipoQualisAntigo qualisAntigo) {
        this.qualisAntigo = qualisAntigo;
    }

    public boolean isFlagPredatorio() {
        return flagPredatorio;
    }

    public void setFlagPredatorio(boolean flagPredatorio) {
        this.flagPredatorio = flagPredatorio;
    }
}
