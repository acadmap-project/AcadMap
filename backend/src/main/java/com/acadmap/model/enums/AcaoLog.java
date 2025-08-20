package com.acadmap.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum AcaoLog {

  adicao_veiculo("adicao_veiculo"),
  exclusao_veiculo("exclusao_veiculo"),
  atualizacao_veiculo("atualizacao_veiculo"),
  cadastro_veiculo_recusado("cadastro_veiculo_recusado"),
  cadastro_veiculo_aceito("cadastro_veiculo_aceito"),
  cadastro_usuario("cadastro_usuario"),
  exclusao_usuario("exclusao_usuario"),
  geracao_csv("geracao_csv"),
  geracao_grafico("geracao_grafico"),
  erro_grafico("erro_grafico");

  private String codigo;

  private AcaoLog(String codigo) {
    this.codigo = codigo;
  }

  public String getCodigo() {
    return this.codigo;
  }

  public void setCodigo(String codigo) {
    this.codigo = codigo;
  }

  @JsonCreator
  public static AcaoLog doValor(String codigo) {
    for (AcaoLog acao : AcaoLog.values()) {
      if (acao.getCodigo().equals(codigo.toLowerCase())) {
        return acao;
      }
    }
    throw new IllegalArgumentException("Ta errado o enum paizão");
  }
}
