package com.acadmap.model;
import com.acadmap.model.enums.TipoClassificacao;
import com.acadmap.model.enums.TipoDefesa;
import com.acadmap.model.enums.TipoStatus;
import com.acadmap.model.enums.TipoVeiculo;
import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "VeiculoPublicacao")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class VeiculoPublicacao { // Pode ser abstrata ou não

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_veiculo")
    private UUID id;

    @Column(name = "nome", length = 255, nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(name = "classificacao", nullable = false, columnDefinition = "tipo_classificacao")
    private TipoClassificacao classificacao;

    @Column(name = "area_conhecimento", length = 255, nullable = false)
    private String areaConhecimento;

    @Column(name = "vinculo_sbc", nullable = false)
    private boolean vinculoSbc;

    @Enumerated(EnumType.STRING)
    @Column(name = "adequado_defesa", nullable = false, columnDefinition = "tipo_defesa")
    private TipoDefesa adequadoDefesa;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, columnDefinition = "tipo_veiculo")
    private TipoVeiculo tipo; // Discriminador implícito para algumas estratégias, mas aqui é um campo normal

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "tipo_status default 'pendente'")
    private TipoStatus status = TipoStatus.pendente; // Valor padrão Java

    @OneToMany(mappedBy = "veiculoPublicacao")
    private List<LogSistema> logs;

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

    public TipoClassificacao getClassificacao() {
        return classificacao;
    }

    public void setClassificacao(TipoClassificacao classificacao) {
        this.classificacao = classificacao;
    }

    public String getAreaConhecimento() {
        return areaConhecimento;
    }

    public void setAreaConhecimento(String areaConhecimento) {
        this.areaConhecimento = areaConhecimento;
    }

    public boolean isVinculoSbc() {
        return vinculoSbc;
    }

    public void setVinculoSbc(boolean vinculoSbc) {
        this.vinculoSbc = vinculoSbc;
    }

    public TipoDefesa getAdequadoDefesa() {
        return adequadoDefesa;
    }

    public void setAdequadoDefesa(TipoDefesa adequadoDefesa) {
        this.adequadoDefesa = adequadoDefesa;
    }

    public TipoVeiculo getTipo() {
        return tipo;
    }

    public void setTipo(TipoVeiculo tipo) {
        this.tipo = tipo;
    }

    public TipoStatus getStatus() {
        return status;
    }

    public void setStatus(TipoStatus status) {
        this.status = status;
    }

    public List<LogSistema> getLogs() {
        return logs;
    }

    public void setLogs(List<LogSistema> logs) {
        this.logs = logs;
    }
}
