-- ====================================================================
-- SCRIPT DE INSERÇÃO DE DADOS DE EXEMPLO
-- ====================================================================
-- PRÉ-REQUISITOS:
-- 1. As tabelas devem ter sido criadas (init.sql).
-- 2. As tabelas 'Programa' e 'AreaPesquisa' devem ter sido populadas (insert.sql).
-- ====================================================================
DO $$
DECLARE
    -- IDs DE PROGRAMAS E ÁREAS
    id_programa_computacao    uuid := 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    id_area_comp              uuid := 'a111a111-b222-c333-d444-e555e555e555';
    id_area_eng_eletrica      uuid := 'b222b222-c333-d444-e555-f666f666f666';

    -- IDs de Novos Usuários
    id_usuario_admin          uuid := '00000000-0000-0000-0000-000000000001';
    id_usuario_pesquisador_1  uuid := '11111111-1111-1111-1111-111111111111';
    id_usuario_pesquisador_2  uuid := '22222222-2222-2222-2222-222222222222';
    id_usuario_auditor        uuid := '33333333-3333-3333-3333-333333333333';
    id_usuario_a_ser_excluido uuid := '44444444-4444-4444-4444-444444444444';

    -- IDs de Novos Veículos de Publicação
    id_veiculo_periodico_aceito uuid := '55555555-5555-5555-5555-555555555555';
    id_veiculo_evento_pendente  uuid := '66666666-6666-6666-6666-666666666666';
    id_veiculo_evento_negado    uuid := '77777777-7777-7777-7777-777777777777';

    -- IDs para Logs
    id_log_1 uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    id_log_2 uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
    id_log_3 uuid := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    id_log_4 uuid := 'dddddddd-dddd-dddd-dddd-dddddddddddd';
    id_log_5 uuid := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
    id_log_6 uuid := 'ffffffff-ffff-ffff-ffff-ffffffffffff';

BEGIN

-- ====================================================================
-- 2. INSERÇÃO DE USUÁRIOS
-- ====================================================================

-- Usuário Administrador
INSERT INTO Usuario (id_usuario, id_programa, nome, email, senha, tipo_perfil)
VALUES (id_usuario_admin, id_programa_computacao, 'Admin Mestre', 'admin@email.com', 'hash_senha_admin', 'administrador');

-- Pesquisador 1 (Ativo)
INSERT INTO Usuario (id_usuario, id_programa, nome, email, senha, tipo_perfil)
VALUES (id_usuario_pesquisador_1, id_programa_computacao, 'Dra. Ada Lovelace', 'ada.lovelace@email.com', 'hash_senha_ada', 'pesquisador');

-- Pesquisador 2 (Ativo)
INSERT INTO Usuario (id_usuario, id_programa, nome, email, senha, tipo_perfil)
VALUES (id_usuario_pesquisador_2, id_programa_computacao, 'Dr. Alan Turing', 'alan.turing@email.com', 'hash_senha_turing', 'pesquisador');

-- Usuário Auditor
INSERT INTO Usuario (id_usuario, id_programa, nome, email, senha, tipo_perfil)
VALUES (id_usuario_auditor, id_programa_computacao, 'Grace Hopper', 'grace.hopper@email.com', 'hash_senha_grace', 'auditor');

-- Usuário que será "excluído" (será marcado como inativo e terá um log de exclusão)
INSERT INTO Usuario (id_usuario, id_programa, nome, email, senha, tipo_perfil, flag_ativo)
VALUES (id_usuario_a_ser_excluido, id_programa_computacao, 'Usuário Antigo', 'antigo@email.com', 'hash_senha_antiga', 'pesquisador', false);


-- ====================================================================
-- 3. RELACIONAMENTO USUÁRIO <-> ÁREA DE PESQUISA
-- ====================================================================

-- Dra. Ada Lovelace atua em Ciência da Computação e Engenharia Elétrica
INSERT INTO AreaPesquisaUsuario (id_usuario, id_area_pesquisa) VALUES (id_usuario_pesquisador_1, id_area_comp);
INSERT INTO AreaPesquisaUsuario (id_usuario, id_area_pesquisa) VALUES (id_usuario_pesquisador_1, id_area_eng_eletrica);

-- Dr. Alan Turing atua em Ciência da Computação
INSERT INTO AreaPesquisaUsuario (id_usuario, id_area_pesquisa) VALUES (id_usuario_pesquisador_2, id_area_comp);


-- ====================================================================
-- 4. INSERÇÃO DE VEÍCULOS DE PUBLICAÇÃO E SUAS ESPECIALIZAÇÕES
-- ====================================================================

-- Cenário 1: Periódico submetido pela Dra. Ada e ACEITO pelo admin
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES (id_veiculo_periodico_aceito, id_usuario_pesquisador_1, 'Journal of Advanced AI', 'a1', 'vinculo_top_10', 'doutorado', 'periodico', 'aceito');

INSERT INTO Periodico (id_veiculo, ISSN, percentil_jcr,	percentil_scopus, link_jcr, link_scopus, flag_predatorio)
VALUES (id_veiculo_periodico_aceito, '12345678', 95, 83, 'http://jcr.com/jai', 'http://scopus.com/jai', false);

-- Cenário 2: Evento submetido pelo Dr. Alan e ainda PENDENTE
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES (id_veiculo_evento_pendente, id_usuario_pesquisador_2, 'International Conference on Algorithms', 'a2', 'vinculo_comum', 'mestrado_doutorado', 'evento', 'pendente');

INSERT INTO Evento (id_veiculo, h5, link_evento, link_google_scholar)
VALUES (id_veiculo_evento_pendente, 42, 'http://ica.com/2024', 'http://scholar.google.com/ica');

-- Cenário 3: Evento submetido pela Dra. Ada e NEGADO pelo auditor
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES (id_veiculo_evento_negado, id_usuario_pesquisador_1, 'Workshop on Obscure Topics', 'a8', 'sem_vinculo', 'nenhum', 'evento', 'negado');

INSERT INTO Evento (id_veiculo, h5, link_evento)
VALUES (id_veiculo_evento_negado, 5, 'http://woto.com/2023');


-- ====================================================================
-- 5. RELACIONAMENTO VEÍCULO <-> ÁREA DE PESQUISA
-- ====================================================================

-- O periódico de AI tem relação com Ciência da Computação e Eng. Elétrica
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_periodico_aceito, id_area_comp);
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_periodico_aceito, id_area_eng_eletrica);

-- A conferência de algoritmos tem relação com Ciência da Computação
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_evento_pendente, id_area_comp);

-- O workshop negado tem relação com Ciência da Computação
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_evento_negado, id_area_comp);


-- ====================================================================
-- 6. INSERÇÃO DE LOGS PARA CONTAR A HISTÓRIA DAS AÇÕES
-- ====================================================================

-- Log 1: Cadastro da Dra. Ada (ação feita pelo admin)
INSERT INTO Log (id_log, id_usuario, data_hora, acao)
VALUES (id_log_1, id_usuario_admin, NOW() - INTERVAL '5 day', 'cadastro_usuario');

-- Log 2: Submissão do periódico pela Dra. Ada
INSERT INTO Log (id_log, id_usuario, data_hora, acao)
VALUES (id_log_2, id_usuario_pesquisador_1, NOW() - INTERVAL '4 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo)
VALUES (id_log_2, id_veiculo_periodico_aceito);

-- Log 3: Aceite do periódico pelo Admin
INSERT INTO Log (id_log, id_usuario, data_hora, acao)
VALUES (id_log_3, id_usuario_admin, NOW() - INTERVAL '3 day', 'cadastro_veiculo_aceito');
INSERT INTO LogVeiculo (id_log, id_veiculo)
VALUES (id_log_3, id_veiculo_periodico_aceito);

-- Log 4: Recusa do evento pelo Auditor (com justificativa)
INSERT INTO Log (id_log, id_usuario, data_hora, acao)
VALUES (id_log_4, id_usuario_auditor, NOW() - INTERVAL '2 day', 'cadastro_veiculo_recusado');
INSERT INTO LogVeiculo (id_log, id_veiculo)
VALUES (id_log_4, id_veiculo_evento_negado);
INSERT INTO JustificativaRecusa (id_log, justificativa)
VALUES (id_log_4, 'O veículo não possui relevância acadêmica comprovada para o programa. O índice h5 é muito baixo e não possui vínculo com a SBC.');

-- Log 5: Submissão do evento pelo Dr. Alan
INSERT INTO Log (id_log, id_usuario, data_hora, acao)
VALUES (id_log_5, id_usuario_pesquisador_2, NOW() - INTERVAL '1 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo)
VALUES (id_log_5, id_veiculo_evento_pendente);

-- Log 6: Exclusão do "Usuário Antigo" pelo Admin
INSERT INTO Log (id_log, id_usuario, data_hora, acao)
VALUES (id_log_6, id_usuario_admin, NOW(), 'exclusao_usuario');
INSERT INTO LogExclusao (id_log, id_usuario_excluido)
VALUES (id_log_6, id_usuario_a_ser_excluido);


END $$;
