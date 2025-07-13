CREATE TABLE Programa (
  id_programa uuid,
  nome varchar(255) NOT NULL,
  CONSTRAINT pk_programa PRIMARY KEY (id_programa)
);

CREATE TABLE Usuario (
  id_usuario uuid,
  id_programa uuid NOT NULL,
  nome varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  senha varchar(255) NOT NULL,
  tipo_perfil varchar(20) NOT NULL,
  flag_ativo boolean DEFAULT true,
  CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
  CONSTRAINT uq_usuario_email UNIQUE (email),
  CONSTRAINT chk_usuario_tipo_perfil CHECK (tipo_perfil IN ('pesquisador', 'auditor', 'administrador'))
);

CREATE TABLE AreaPesquisa (
  id_area_pesquisa uuid,
  nome varchar(255) NOT NULL,
  CONSTRAINT pk_area_pesquisa PRIMARY KEY (id_area_pesquisa)
);

CREATE TABLE VeiculoPublicacao (
  id_veiculo uuid,
  id_usuario uuid NOT NULL,
  nome varchar(255) NOT NULL,
  classificacao varchar(2) NOT NULL,
  vinculo_sbc varchar(20) NOT NULL,
  adequado_defesa varchar(20) NOT NULL,
  tipo varchar(10) NOT NULL,
  status varchar(10) DEFAULT 'pendente',
  CONSTRAINT pk_veiculo_publicacao PRIMARY KEY (id_veiculo),
  CONSTRAINT chk_veiculo_classificacao CHECK (classificacao IN ('a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8')),
  CONSTRAINT chk_veiculo_vinculo_sbc CHECK (vinculo_sbc IN ('sem_vinculo', 'vinculo_top_10', 'vinculo_top_20', 'vinculo_comum')),
  CONSTRAINT chk_veiculo_adequado_defesa CHECK (adequado_defesa IN ('mestrado', 'doutorado', 'mestrado_doutorado', 'nenhum')),
  CONSTRAINT chk_veiculo_tipo CHECK (tipo IN ('evento', 'periodico')),
  CONSTRAINT chk_veiculo_status CHECK (status IN ('pendente', 'negado', 'aceito', 'excluido'))
);

CREATE TABLE Evento (
  id_veiculo uuid,
  h5 int NOT NULL,
  link_evento varchar(255) NOT NULL,
  link_google_scholar varchar(255),
  link_sol_sbc varchar(255),
  CONSTRAINT pk_evento PRIMARY KEY (id_veiculo)
);

CREATE TABLE Log (
  id_log uuid,
  id_usuario uuid NOT NULL,
  data_hora timestamp NOT NULL,
  acao varchar(30) NOT NULL,
  CONSTRAINT pk_log PRIMARY KEY (id_log),
  CONSTRAINT chk_log_acao CHECK (acao IN (
    'adicao_veiculo',
    'exclusao_veiculo',
    'atualizacao_veiculo',
    'cadastro_veiculo_recusado',
    'cadastro_veiculo_aceito',
    'cadastro_usuario',
    'exclusao_usuario'
  ))
);

CREATE TABLE LogExclusao (
  id_log uuid,
  id_usuario_excluido uuid NOT NULL,
  CONSTRAINT pk_log_exclusao PRIMARY KEY (id_log)
);

CREATE TABLE Periodico (
  id_veiculo uuid,
  ISSN char(8) NOT NULL,
  percentil_jcr int DEFAULT null,
  percentil_scopus int DEFAULT null,
  link_jcr varchar(255),
  link_scopus varchar(255),
  link_google_scholar varchar(255) DEFAULT null,
  qualis_antigo varchar(2) DEFAULT null,
  flag_predatorio boolean DEFAULT false,
  CONSTRAINT pk_periodico PRIMARY KEY (id_veiculo),
  CONSTRAINT uq_periodico_issn UNIQUE (ISSN),
  CONSTRAINT chk_periodico_qualis_antigo CHECK (qualis_antigo IS NULL OR qualis_antigo IN ('a1', 'a2', 'b1', 'b2', 'b3', 'b4', 'b5', 'c'))
);

CREATE TABLE LogVeiculo (
  id_log uuid,
  id_veiculo uuid NOT NULL,
  CONSTRAINT pk_log_veiculo PRIMARY KEY (id_log)
);

CREATE TABLE AreaPesquisaUsuario (
  id_usuario uuid,
  id_area_pesquisa uuid,
  CONSTRAINT pk_area_pesquisa_usuario PRIMARY KEY (id_usuario, id_area_pesquisa)
);

CREATE TABLE AreaPesquisaVeiculo (
  id_area_pesquisa uuid,
  id_veiculo uuid,
  CONSTRAINT pk_area_pesquisa_veiculo PRIMARY KEY (id_area_pesquisa, id_veiculo)
);

CREATE TABLE JustificativaRecusa (
  id_log uuid,
  justificativa varchar(1000) NOT NULL,
  CONSTRAINT pk_justificativa_recusa PRIMARY KEY (id_log)
);

-- Foreign Keys
ALTER TABLE Usuario ADD CONSTRAINT fk_usuario_programa FOREIGN KEY (id_programa) REFERENCES Programa (id_programa);

ALTER TABLE Evento ADD CONSTRAINT fk_evento_veiculopublicacao FOREIGN KEY (id_veiculo) REFERENCES VeiculoPublicacao (id_veiculo);

ALTER TABLE Periodico ADD CONSTRAINT fk_periodico_veiculopublicacao FOREIGN KEY (id_veiculo) REFERENCES VeiculoPublicacao (id_veiculo);

ALTER TABLE Log ADD CONSTRAINT fk_log_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario);

ALTER TABLE LogExclusao ADD CONSTRAINT fk_logexclusao_log FOREIGN KEY (id_log) REFERENCES Log (id_log);
ALTER TABLE LogExclusao ADD CONSTRAINT fk_logexclusao_usuario FOREIGN KEY (id_usuario_excluido) REFERENCES Usuario (id_usuario);

ALTER TABLE LogVeiculo ADD CONSTRAINT fk_logveiculo_log FOREIGN KEY (id_log) REFERENCES Log (id_log);
ALTER TABLE LogVeiculo ADD CONSTRAINT fk_logveiculo_veiculopublicacao FOREIGN KEY (id_veiculo) REFERENCES VeiculoPublicacao (id_veiculo);

ALTER TABLE JustificativaRecusa ADD CONSTRAINT fk_justificativarecusa_logveiculo FOREIGN KEY (id_log) REFERENCES LogVeiculo (id_log);

ALTER TABLE AreaPesquisaUsuario ADD CONSTRAINT fk_areapesquisusuario_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario);
ALTER TABLE AreaPesquisaUsuario ADD CONSTRAINT fk_areapesquisusuario_areapesquisa FOREIGN KEY (id_area_pesquisa) REFERENCES AreaPesquisa (id_area_pesquisa);

ALTER TABLE AreaPesquisaVeiculo ADD CONSTRAINT fk_areapesquisaveiculo_areapesquisa FOREIGN KEY (id_area_pesquisa) REFERENCES AreaPesquisa (id_area_pesquisa);
ALTER TABLE AreaPesquisaVeiculo ADD CONSTRAINT fk_areapesquisaveiculo_veiculopublicacao FOREIGN KEY (id_veiculo) REFERENCES VeiculoPublicacao (id_veiculo);
ALTER TABLE VeiculoPublicacao ADD CONSTRAINT fk_veiculopublicacao_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario);
