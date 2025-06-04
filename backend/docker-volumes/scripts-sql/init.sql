CREATE TABLE Usuario (
  "id_usuario" uuid,
  "id_area_pesquisa" uuid NOT NULL,
  "id_programa" uuid NOT NULL,
  "nome" varchar(255) NOT NULL,
  "email" varchar(255) UNIQUE NOT NULL,
  "senha" varchar(255) NOT NULL,
  "tipo_perfil" varchar(20) NOT NULL,

  CONSTRAINT primary_key_usuario PRIMARY KEY ("id_usuario"),
  CONSTRAINT chk_usuario_tipo_perfil CHECK (tipo_perfil IN ('pesquisador', 'auditor', 'administrador'))
);

CREATE TABLE AreaPesquisa (
  "id_area_pesquisa" uuid,
  "nome" varchar(255),

  CONSTRAINT primary_key_areapesquisa PRIMARY KEY ("id_area_pesquisa")
);

CREATE TABLE Programa (
  "id_programa" uuid,
  "nome" varchar(255),

  CONSTRAINT primary_key_programa PRIMARY KEY ("id_programa")
);

CREATE TABLE VeiculoPublicacao (
  "id_veiculo" uuid,
  "nome" varchar(255) NOT NULL,
  "classificacao" varchar(2) NOT NULL,
  "area_conhecimento" varchar(255) NOT NULL,
  "vinculo_sbc" boolean NOT NULL,
  "adequado_defesa" varchar(20) NOT NULL,
  "tipo" varchar(10) NOT NULL,
  "status" varchar(10) DEFAULT 'pendente',

  CONSTRAINT primary_key_veiculopublicacao PRIMARY KEY ("id_veiculo"),
  CONSTRAINT chk_veiculo_classificacao CHECK (classificacao IN ('a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8')),
  CONSTRAINT chk_veiculo_adequado_defesa CHECK (adequado_defesa IN ('mestrado', 'doutorado', 'mestrado_douturado', 'nenhum')),
  CONSTRAINT chk_veiculo_tipo CHECK (tipo IN ('evento', 'periodico')),
  CONSTRAINT chk_veiculo_status CHECK (status IN ('pendente', 'negado', 'aceito'))
);

CREATE TABLE Evento (
  "id_veiculo" uuid,
  "h5" int NOT NULL,
  "link_evento" varchar(255) NOT NULL,
  "link_google_scholar" varchar(255),
  "link_sol_sbc" varchar(255),

  CONSTRAINT primary_key_evento PRIMARY KEY ("id_veiculo")
);

CREATE TABLE Periodico (
  "id_veiculo" uuid,
  "ISSN" char(8) UNIQUE NOT NULL,
  "percentil" int NOT NULL,
  "link_jcr" varchar(255),
  "link_scopus" varchar(255),
  "link_google_scholar" varchar(255) DEFAULT null,
  "qualis_antigo" varchar(2) DEFAULT null,
  "flag_predatorio" boolean DEFAULT false,

  CONSTRAINT primary_key_periodico PRIMARY KEY ("id_veiculo"),
  CONSTRAINT chk_periodico_qualis_antigo CHECK (qualis_antigo IS NULL OR qualis_antigo IN ('a1', 'a2', 'b1', 'b2', 'b3', 'b4', 'b5', 'c'))
);

CREATE TABLE LogSistema (
  "id_log" uuid,
  "id_usuario" uuid NOT NULL,
  "id_veiculo" uuid NOT NULL,
  "data_hora" timestamp NOT NULL,
  "acao" varchar(20) NOT NULL,

  CONSTRAINT primary_key_logsistema PRIMARY KEY ("id_log"),
  CONSTRAINT chk_log_acao CHECK (acao IN ('adicao', 'exclusao', 'atualizacao', 'cadastro_recusado', 'cadastro_aceito'))
);

CREATE TABLE JustificativaRecusa (
  "id_log" uuid,
  "justificativa" varchar(1000),

  CONSTRAINT primary_key_justificativarecusa PRIMARY KEY ("id_log")
);

ALTER TABLE JustificativaRecusa ADD FOREIGN KEY ("id_log") REFERENCES LogSistema ("id_log");

ALTER TABLE Usuario ADD FOREIGN KEY ("id_programa") REFERENCES Programa ("id_programa");

ALTER TABLE Usuario ADD FOREIGN KEY ("id_area_pesquisa") REFERENCES AreaPesquisa ("id_area_pesquisa");

ALTER TABLE Evento ADD FOREIGN KEY ("id_veiculo") REFERENCES VeiculoPublicacao ("id_veiculo");

ALTER TABLE Periodico ADD FOREIGN KEY ("id_veiculo") REFERENCES VeiculoPublicacao ("id_veiculo");

ALTER TABLE LogSistema ADD FOREIGN KEY ("id_usuario") REFERENCES Usuario ("id_usuario");

ALTER TABLE LogSistema ADD FOREIGN KEY ("id_veiculo") REFERENCES VeiculoPublicacao ("id_veiculo");

commit;
