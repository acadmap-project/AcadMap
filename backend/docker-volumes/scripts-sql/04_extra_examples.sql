-- ====================================================================
-- SCRIPT DE INSERÇÃO DE DADOS EXTRAS PARA TESTES
-- PRÉ-REQUISITOS:
-- 1. As tabelas devem ter sido criadas (init.sql).
-- 2. As tabelas 'Programa' e 'AreaPesquisa' já estão populadas (insert.sql).
-- 3. Os exemplos anteriores (03_examples.sql) já foram executados.
-- ====================================================================

DO $$
DECLARE
    id_programa_computacao    uuid := 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    id_area_comp              uuid := 'a111a111-b222-c333-d444-e555e555e555';
    id_area_eng_eletrica      uuid := 'b222b222-c333-d444-e555-f666f666f666';

    -- Novos usuários
    id_usuario_pesquisador_3  uuid := '55555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    id_usuario_auditor_2      uuid := '66666666-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

    -- Novos veículos
    id_veiculo_periodico_pendente uuid := '88888888-cccc-cccc-cccc-cccccccccccc';
    id_veiculo_evento_aceito      uuid := '99999999-dddd-dddd-dddd-dddddddddddd';

    -- Novos logs
    id_log_7 uuid := '77777777-eeee-eeee-eeee-eeeeeeeeeeee';
    id_log_8 uuid := '88888888-ffff-ffff-ffff-ffffffffffff';
    id_log_9 uuid := '99999999-1111-1111-1111-111111111111';
BEGIN

-- ====================================================================
-- Novos usuários
-- ====================================================================
INSERT INTO Usuario (id_usuario, id_programa, nome, email, senha, tipo_perfil)
VALUES 
(id_usuario_pesquisador_3, id_programa_computacao, 'Prof. Barbara Liskov', 'barbara.liskov@email.com', 'hash_senha_barbara', 'pesquisador'),
(id_usuario_auditor_2, id_programa_computacao, 'John von Neumann', 'john.neumann@email.com', 'hash_senha_neumann', 'auditor');

-- Relacionamentos com área de pesquisa
INSERT INTO AreaPesquisaUsuario (id_usuario, id_area_pesquisa)
VALUES
(id_usuario_pesquisador_3, id_area_comp),
(id_usuario_pesquisador_3, id_area_eng_eletrica);

-- ====================================================================
-- Novos veículos
-- ====================================================================

-- Periódico pendente
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES 
(id_veiculo_periodico_pendente, id_usuario_pesquisador_3, 'Computing Systems Journal', 'a3', 'vinculo_top_20', 'mestrado', 'periodico', 'pendente');

INSERT INTO Periodico (id_veiculo, ISSN, percentil, link_jcr, link_scopus, qualis_antigo, flag_predatorio)
VALUES 
(id_veiculo_periodico_pendente, '87654321', 75, 'http://jcr.com/csj', 'http://scopus.com/csj', 'b1', false);

-- Evento aceito
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES 
(id_veiculo_evento_aceito, id_usuario_pesquisador_3, 'Symposium on Distributed Computing', 'a2', 'vinculo_top_10', 'doutorado', 'evento', 'aceito');

INSERT INTO Evento (id_veiculo, h5, link_evento, link_google_scholar)
VALUES 
(id_veiculo_evento_aceito, 50, 'http://sdc.com/2024', 'http://scholar.google.com/sdc');

-- Relacionamentos com área de pesquisa
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa)
VALUES
(id_veiculo_periodico_pendente, id_area_comp),
(id_veiculo_evento_aceito, id_area_comp),
(id_veiculo_evento_aceito, id_area_eng_eletrica);

-- ====================================================================
-- Novos logs
-- ====================================================================

-- Log 7: Submissão do periódico pendente
INSERT INTO Log (id_log, id_usuario, data_hora, acao)
VALUES 
(id_log_7, id_usuario_pesquisador_3, NOW() - INTERVAL '2 day', 'adicao_veiculo');

INSERT INTO LogVeiculo (id_log, id_veiculo)
VALUES 
(id_log_7, id_veiculo_periodico_pendente);

-- Log 8: Submissão do evento aceito
INSERT INTO Log (id_log, id_usuario, data_hora, acao)
VALUES 
(id_log_8, id_usuario_pesquisador_3, NOW() - INTERVAL '1 day', 'adicao_veiculo');

INSERT INTO LogVeiculo (id_log, id_veiculo)
VALUES 
(id_log_8, id_veiculo_evento_aceito);

-- Log 9: Aceite do evento pelo novo auditor
INSERT INTO Log (id_log, id_usuario, data_hora, acao)
VALUES 
(id_log_9, id_usuario_auditor_2, NOW(), 'cadastro_veiculo_aceito');

INSERT INTO LogVeiculo (id_log, id_veiculo)
VALUES 
(id_log_9, id_veiculo_evento_aceito);

END $$;

