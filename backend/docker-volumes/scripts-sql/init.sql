CREATE TYPE "tipo_usuario" AS ENUM (
  'pesquisador',
  'auditor',
  'administrador'
);

CREATE TYPE "tipo_defesa" AS ENUM (
  'mestrado',
  'doutorado',
  'mestrado_douturado',
  'nenhum'
);

CREATE TYPE "tipo_veiculo" AS ENUM (
  'evento',
  'periodico'
);

CREATE TYPE "tipo_status" AS ENUM (
  'pendente',
  'negado',
  'aceito'
);

CREATE TYPE "tipo_acao" AS ENUM (
  'adicao',
  'exclusao',
  'atualizacao',
  'cadastro_recusado',
  'cadastro_aceito'
);

CREATE TYPE "tipo_qualis_antigo" AS ENUM (
  'a1',
  'a2',
  'b1',
  'b2',
  'b3',
  'b4',
  'b5',
  'c'
);

CREATE TYPE "tipo_classificacao" AS ENUM (
  'a1',
  'a2',
  'a3',
  'a4',
  'a5',
  'a6',
  'a7',
  'a8'
);

CREATE TABLE Usuario (
  "id_usuario" uuid,
  "id_area_pesquisa" uuid NOT NULL,
  "id_programa" uuid NOT NULL,
  "nome" varchar(255) NOT NULL,
  "email" varchar(255) UNIQUE NOT NULL,
  "senha" varchar(255) NOT NULL,
  "tipo_perfil" tipo_usuario NOT NULL,

  CONSTRAINT primary_key_usuario PRIMARY KEY ("id_usuario")
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
  "classificacao" tipo_classificacao NOT NULL,
  "area_conhecimento" varchar(255) NOT NULL,
  "vinculo_sbc" boolean NOT NULL,
  "adequado_defesa" tipo_defesa NOT NULL,
  "tipo" tipo_veiculo NOT NULL,
  "status" tipo_status DEFAULT 'pendente',

  CONSTRAINT primary_key_veiculopublicacao PRIMARY KEY ("id_veiculo")
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
  "qualis_antigo" tipo_qualis_antigo DEFAULT null,
  "flag_predatorio" boolean DEFAULT false,

  CONSTRAINT primary_key_periodico PRIMARY KEY ("id_veiculo")
);

CREATE TABLE LogSistema (
  "id_log" uuid,
  "id_usuario" uuid NOT NULL,
  "id_veiculo" uuid NOT NULL,
  "data_hora" date NOT NULL,
  "acao" tipo_acao NOT NULL,

  CONSTRAINT primary_key_logsistema PRIMARY KEY ("id_log")
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

