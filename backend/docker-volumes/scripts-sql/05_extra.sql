
-- ====================================================================
-- SCRIPT DE INSERÇÃO MASSIVA DE DADOS DE EXEMPLO
-- ====================================================================
-- OBJETIVO:
-- Adicionar uma quantidade considerável de dados para popular o banco,
-- permitindo testes de performance, paginação e cenários complexos.
--
-- PRÉ-REQUISITOS:
-- 1. As tabelas devem ter sido criadas (init.sql).
-- 2. As tabelas 'Programa' e 'AreaPesquisa' devem estar populadas (insert.sql).
-- 3. Os dados de exemplo iniciais devem ter sido inseridos (examples.sql, extra_examples.sql).
-- ====================================================================

DO $$
DECLARE
    -- IDs de Entidades Existentes (para referência)
    id_programa_computacao    uuid := 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    id_area_comp              uuid := 'a111a111-b222-c333-d444-e555e555e555';
    id_area_eng_eletrica      uuid := 'b222b222-c333-d444-e555-f666f666f666';
    id_usuario_admin        uuid := '00000000-0000-0000-0000-000000000001';
    id_usuario_auditor      uuid := '33333333-3333-3333-3333-333333333333';
    id_usuario_auditor_2     uuid := '66666666-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

    -- IDs para Novos Usuários
    id_pesq_knuth             uuid := gen_random_uuid();
    id_pesq_dijkstra          uuid := gen_random_uuid();
    id_pesq_cormen            uuid := gen_random_uuid();
    id_pesq_rivest            uuid := gen_random_uuid();
    id_pesq_shamir            uuid := gen_random_uuid();
    id_pesq_torvalds          uuid := gen_random_uuid();
    id_pesq_berners_lee       uuid := gen_random_uuid();
    id_pesq_cerf              uuid := gen_random_uuid();
    id_pesq_kahn              uuid := gen_random_uuid();
    id_pesq_mccarthy          uuid := gen_random_uuid();
    id_auditor_3              uuid := gen_random_uuid();
    id_auditor_4              uuid := gen_random_uuid();

-- IDs para Novos Veículos (agora fixos)
-- Knuth
id_veiculo_knuth_1        uuid := '11111111-1111-1111-1111-111111111101';
id_veiculo_knuth_2        uuid := '11111111-1111-1111-1111-111111111102';
-- Dijkstra
id_veiculo_dijkstra_1     uuid := '11111111-1111-1111-1111-111111111103';
-- Cormen
id_veiculo_cormen_1       uuid := '11111111-1111-1111-1111-111111111104';
id_veiculo_cormen_2       uuid := '11111111-1111-1111-1111-111111111105';
-- Rivest
id_veiculo_rivest_1       uuid := '11111111-1111-1111-1111-111111111106';
id_veiculo_rivest_2       uuid := '11111111-1111-1111-1111-111111111107';
-- Shamir
id_veiculo_shamir_1       uuid := '11111111-1111-1111-1111-111111111108';
-- Torvalds
id_veiculo_torvalds_1     uuid := '11111111-1111-1111-1111-111111111109';
id_veiculo_torvalds_2     uuid := '11111111-1111-1111-1111-11111111110a';
-- Berners-Lee
id_veiculo_berners_1      uuid := '11111111-1111-1111-1111-11111111110b';
id_veiculo_berners_2      uuid := '11111111-1111-1111-1111-11111111110c';
-- Cerf
id_veiculo_cerf_1         uuid := '11111111-1111-1111-1111-11111111110d';
id_veiculo_cerf_2         uuid := '11111111-1111-1111-1111-11111111110e';
-- Kahn
id_veiculo_kahn_1         uuid := '11111111-1111-1111-1111-11111111110f';
id_veiculo_kahn_2         uuid := '11111111-1111-1111-1111-111111111110';
-- McCarthy
id_veiculo_mccarthy_1     uuid := '11111111-1111-1111-1111-111111111111';
id_veiculo_mccarthy_2     uuid := '11111111-1111-1111-1111-111111111112';
id_veiculo_mccarthy_3     uuid := '11111111-1111-1111-1111-111111111113';

    
-- IDs para Novos Logs (gerados dinamicamente)
log_id                    uuid;

BEGIN

-- ====================================================================
-- 1. INSERÇÃO DE NOVOS USUÁRIOS (PESQUISADORES E AUDITORES)
-- ====================================================================

RAISE NOTICE 'Inserindo novos usuários...';

INSERT INTO Usuario (id_usuario, id_programa, nome, email, senha, tipo_perfil) VALUES
(id_pesq_knuth,       id_programa_computacao, 'Donald Knuth',       'donald.knuth@email.com',       '$2a$12$crLybWRZ3IrM2zF5FOsL6uXqWftAWiXwnaWRJ/PGjKcb2s4hYeC0e', 'pesquisador'),
(id_pesq_dijkstra,    id_programa_computacao, 'Edsger Dijkstra',    'edsger.dijkstra@email.com',    '$2a$12$crLybWRZ3IrM2zF5FOsL6uXqWftAWiXwnaWRJ/PGjKcb2s4hYeC0e', 'pesquisador'),
(id_pesq_cormen,      id_programa_computacao, 'Thomas H. Cormen',   'thomas.cormen@email.com',      '$2a$12$crLybWRZ3IrM2zF5FOsL6uXqWftAWiXwnaWRJ/PGjKcb2s4hYeC0e', 'pesquisador'),
(id_pesq_rivest,      id_programa_computacao, 'Ronald Rivest',      'ronald.rivest@email.com',      '$2a$12$crLybWRZ3IrM2zF5FOsL6uXqWftAWiXwnaWRJ/PGjKcb2s4hYeC0e', 'pesquisador'),
(id_pesq_shamir,      id_programa_computacao, 'Adi Shamir',         'adi.shamir@email.com',         '$2a$12$crLybWRZ3IrM2zF5FOsL6uXqWftAWiXwnaWRJ/PGjKcb2s4hYeC0e', 'pesquisador'),
(id_pesq_torvalds,    id_programa_computacao, 'Linus Torvalds',     'linus.torvalds@email.com',     '$2a$12$crLybWRZ3IrM2zF5FOsL6uXqWftAWiXwnaWRJ/PGjKcb2s4hYeC0e', 'pesquisador'),
(id_pesq_berners_lee, id_programa_computacao, 'Tim Berners-Lee',    'tim.berners.lee@email.com',    '$2a$12$crLybWRZ3IrM2zF5FOsL6uXqWftAWiXwnaWRJ/PGjKcb2s4hYeC0e', 'pesquisador'),
(id_pesq_cerf,        id_programa_computacao, 'Vint Cerf',          'vint.cerf@email.com',          '$2a$12$crLybWRZ3IrM2zF5FOsL6uXqWftAWiXwnaWRJ/PGjKcb2s4hYeC0e', 'pesquisador'),
(id_pesq_kahn,        id_programa_computacao, 'Robert E. Kahn',     'robert.kahn@email.com',        '$2a$12$crLybWRZ3IrM2zF5FOsL6uXqWftAWiXwnaWRJ/PGjKcb2s4hYeC0e', 'pesquisador'),
(id_pesq_mccarthy,    id_programa_computacao, 'John McCarthy',      'john.mccarthy@email.com',      '$2a$12$crLybWRZ3IrM2zF5FOsL6uXqWftAWiXwnaWRJ/PGjKcb2s4hYeC0e', 'pesquisador'),
(id_auditor_3,        id_programa_computacao, 'Margaret Hamilton',  'margaret.hamilton@email.com',  '$2a$12$crLybWRZ3IrM2zF5FOsL6uXqWftAWiXwnaWRJ/PGjKcb2s4hYeC0e', 'auditor'),
(id_auditor_4,        id_programa_computacao, 'Radia Perlman',      'radia.perlman@email.com',      '$2a$12$crLybWRZ3IrM2zF5FOsL6uXqWftAWiXwnaWRJ/PGjKcb2s4hYeC0e', 'auditor');

-- Relacionando novos usuários com áreas de pesquisa
INSERT INTO AreaPesquisaUsuario (id_usuario, id_area_pesquisa) VALUES
(id_pesq_knuth, id_area_comp),
(id_pesq_dijkstra, id_area_comp),
(id_pesq_cormen, id_area_comp),
(id_pesq_rivest, id_area_comp),
(id_pesq_rivest, id_area_eng_eletrica),
(id_pesq_shamir, id_area_comp),
(id_pesq_torvalds, id_area_comp),
(id_pesq_berners_lee, id_area_comp),
(id_pesq_cerf, id_area_comp),
(id_pesq_cerf, id_area_eng_eletrica),
(id_pesq_kahn, id_area_eng_eletrica),
(id_pesq_mccarthy, id_area_comp);

-- ====================================================================
-- 2. INSERÇÃO DE VEÍCULOS E LOGS CORRESPONDENTES
-- ====================================================================

RAISE NOTICE 'Inserindo veículos e logs...';

-- --- Cenários para Donald Knuth ---
-- Periódico ACEITO
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES (id_veiculo_knuth_1, id_pesq_knuth, 'The Art of Computer Programming Journal', 'a1', 'vinculo_top_10', 'doutorado', 'periodico', 'aceito');
INSERT INTO Periodico (id_veiculo, ISSN, percentil_jcr, link_jcr) VALUES (id_veiculo_knuth_1, '11223344', 89, 'http://jcr.com/taocp');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_knuth_1, id_area_comp);
-- Logs
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_knuth, NOW() - INTERVAL '10 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_knuth_1);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_usuario_admin, NOW() - INTERVAL '9 day', 'cadastro_veiculo_aceito');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_knuth_1);

-- Evento PENDENTE
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, h5, link_google_scholar, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES (id_veiculo_knuth_2, id_pesq_knuth, 'Symposium on Literate Programming', 35, 'http://scholar.google.com/slp', 'a3', 'vinculo_comum', 'mestrado_doutorado', 'evento', 'pendente');
INSERT INTO Evento (id_veiculo, link_sol_sbc) VALUES (id_veiculo_knuth_2, 'http://sol-sbc/slp/2024');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_knuth_2, id_area_comp);
-- Log
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_knuth, NOW() - INTERVAL '2 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_knuth_2);


-- --- Cenários para Edsger Dijkstra ---
-- Evento NEGADO
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, h5, link_google_scholar, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES
(id_veiculo_dijkstra_1, id_pesq_dijkstra, 'Workshop on Formal Methods Verification', 20 , 'http://scholar.google.com/wfmv','a4', 'sem_vinculo', 'mestrado', 'evento', 'negado');
INSERT INTO Evento (id_veiculo, link_sol_sbc) VALUES (id_veiculo_dijkstra_1,'http://sol-sbc/slp/2024');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_dijkstra_1, id_area_comp);
-- Logs
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_dijkstra, NOW() - INTERVAL '15 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_dijkstra_1);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_usuario_auditor, NOW() - INTERVAL '14 day', 'cadastro_veiculo_recusado');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_dijkstra_1);
INSERT INTO JustificativaRecusa (id_log, justificativa) VALUES (log_id, 'Evento sem vínculo com a SBC e com métricas de impacto (h5) abaixo do recomendado para o programa.');


-- --- Cenários para Thomas H. Cormen ---
-- Periódico PENDENTE
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES (id_veiculo_cormen_1, id_pesq_cormen, 'Journal of Concrete Mathematics and Algorithms', 'a2', 'vinculo_top_20', 'doutorado', 'periodico', 'pendente');
INSERT INTO Periodico (id_veiculo, ISSN, percentil_scopus, link_scopus) VALUES (id_veiculo_cormen_1, '55667788', 88, 'http://scopus.com/jcma');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_cormen_1, id_area_comp);
-- Log
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_cormen, NOW() - INTERVAL '1 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_cormen_1);

-- Evento ACEITO
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, h5, link_google_scholar, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES
(id_veiculo_cormen_2, id_pesq_cormen, 'Conference on Introduction to Algorithms (CIA)', 60, 'http://scholar.google.com', 'a1', 'vinculo_top_10', 'mestrado_doutorado', 'evento', 'aceito');
INSERT INTO Evento (id_veiculo, link_sol_sbc) VALUES (id_veiculo_cormen_2, 'http://sol.sbc.org.br/cia');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_cormen_2, id_area_comp);
-- Logs
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_cormen, NOW() - INTERVAL '20 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_cormen_2);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_usuario_auditor_2, NOW() - INTERVAL '18 day', 'cadastro_veiculo_aceito');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_cormen_2);


-- --- Cenários para Ronald Rivest ---
-- Periódico ACEITO (área dupla)
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, h5, link_google_scholar, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES (id_veiculo_rivest_1, id_pesq_rivest, 'IEEE Transactions on Information Theory', 60, 'http://scholar.google.com', 'a1', 'vinculo_top_10', 'doutorado', 'periodico', 'aceito');
INSERT INTO Periodico (id_veiculo, ISSN, qualis_antigo) VALUES (id_veiculo_rivest_1, '99887766', 'a1');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_rivest_1, id_area_comp);
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_rivest_1, id_area_eng_eletrica);
-- Logs
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_rivest, NOW() - INTERVAL '30 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_rivest_1);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_auditor_3, NOW() - INTERVAL '25 day', 'cadastro_veiculo_aceito');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_rivest_1);

-- Evento PENDENTE
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, h5, link_google_scholar, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES (id_veiculo_rivest_2, id_pesq_rivest, 'International Cryptology Conference (CRYPTO)', 70, 'http://scholar.google.com', 'a1', 'vinculo_top_10', 'doutorado', 'evento', 'pendente');
INSERT INTO Evento (id_veiculo, link_sol_sbc) VALUES (id_veiculo_rivest_2, 'http://sol.sbc.org.br/icc');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_rivest_2, id_area_comp);
-- Log
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_rivest, NOW() - INTERVAL '3 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_rivest_2);

-- --- Cenário para Adi Shamir ---
-- Periódico NEGADO (predatório)
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES (id_veiculo_shamir_1, id_pesq_shamir, 'Global Journal of Computer Science Research', 'a7', 'sem_vinculo', 'nenhum', 'periodico', 'negado');
INSERT INTO Periodico (id_veiculo, ISSN, percentil_jcr, link_jcr, flag_predatorio) VALUES (id_veiculo_shamir_1, '12121212', 15, 'http://jcr.com/taocp', true);
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_shamir_1, id_area_comp);
-- Logs
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_shamir, NOW() - INTERVAL '8 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_shamir_1);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_auditor_4, NOW() - INTERVAL '7 day', 'cadastro_veiculo_recusado');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_shamir_1);
INSERT INTO JustificativaRecusa (id_log, justificativa) VALUES (log_id, 'Veículo identificado como periódico predatório, com baixo percentil e sem relevância acadêmica.');


-- --- Cenário para Linus Torvalds ---
-- Evento ACEITO
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, h5, link_google_scholar, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES (id_veiculo_torvalds_1, id_pesq_torvalds, 'Linux Kernel Summit', 55, 'http://scholar.google/lks', 'a2', 'vinculo_comum', 'mestrado_doutorado', 'evento', 'aceito');
INSERT INTO Evento (id_veiculo, link_sol_sbc) VALUES (id_veiculo_torvalds_1, 'http://sol.sbc.org.br/lks');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_torvalds_1, id_area_comp);
-- Logs
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_torvalds, NOW() - INTERVAL '40 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_torvalds_1);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_usuario_admin, NOW() - INTERVAL '35 day', 'cadastro_veiculo_aceito');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_torvalds_1);

-- Periódico PENDENTE
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES (id_veiculo_torvalds_2, id_pesq_torvalds, 'Journal of Open Source Systems', 'a4', 'vinculo_comum', 'mestrado', 'periodico', 'pendente');
INSERT INTO Periodico (id_veiculo, ISSN, percentil_scopus, link_scopus) VALUES (id_veiculo_torvalds_2, '23232323', 65, 'http://scopus.com/joss');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_torvalds_2, id_area_comp);
-- Log
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_torvalds, NOW() - INTERVAL '4 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_torvalds_2);


-- --- Cenários Adicionais (Restantes) ---
-- Berners-Lee (Web)
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, h5, link_google_scholar, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES (id_veiculo_berners_1, id_pesq_berners_lee, 'The Web Conference', 80, 'http://scholar.google/lks','a1', 'vinculo_top_10', 'doutorado', 'evento', 'aceito');
INSERT INTO Evento (id_veiculo, link_sol_sbc) VALUES (id_veiculo_berners_1, 'http://sol-thewebconf.org');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_berners_1, id_area_comp);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_berners_lee, NOW() - INTERVAL '50 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_berners_1);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_auditor_3, NOW() - INTERVAL '45 day', 'cadastro_veiculo_aceito');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_berners_1);

INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES (id_veiculo_berners_2, id_pesq_berners_lee, 'Journal of Web Science', 'a3', 'vinculo_top_20', 'mestrado_doutorado', 'periodico', 'pendente');
INSERT INTO Periodico (id_veiculo, ISSN, percentil_jcr, link_jcr) VALUES (id_veiculo_berners_2, '45454545', 80, 'http://jcr.com/taocp');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_berners_2, id_area_comp);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_berners_lee, NOW() - INTERVAL '5 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_berners_2);

-- Cerf & Kahn (Redes)
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, h5, link_google_scholar, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
 VALUES (id_veiculo_cerf_1, id_pesq_cerf, 'ACM SIGCOMM', 90, 'http://sigcomm.org', 'a1', 'vinculo_top_10', 'doutorado', 'evento', 'aceito');
INSERT INTO Evento (id_veiculo, link_sol_sbc) VALUES (id_veiculo_cerf_1, 'http://sol.sbc.org.br/sigcomm');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_cerf_1, id_area_comp);
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_cerf_1, id_area_eng_eletrica);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_cerf, NOW() - INTERVAL '60 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_cerf_1);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_auditor_4, NOW() - INTERVAL '55 day', 'cadastro_veiculo_aceito');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_cerf_1);

INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES (id_veiculo_kahn_1, id_pesq_kahn, 'IEEE/ACM Transactions on Networking', 'a1', 'vinculo_top_10', 'doutorado', 'periodico', 'aceito');
INSERT INTO Periodico (id_veiculo, ISSN, percentil_jcr, link_jcr) VALUES (id_veiculo_kahn_1, '67676767', 98, 'http://jcr.com/taocp');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_kahn_1, id_area_eng_eletrica);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_kahn, NOW() - INTERVAL '65 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_kahn_1);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_usuario_admin, NOW() - '62 day'::interval, 'cadastro_veiculo_aceito');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_kahn_1);

-- McCarthy (IA)
INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, h5, link_google_scholar, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES (id_veiculo_mccarthy_1, id_pesq_mccarthy, 'AAAI Conference on Artificial Intelligence', 85, 'http://aaai.org', 'a1', 'vinculo_top_10', 'doutorado', 'evento', 'aceito');
INSERT INTO Evento (id_veiculo, link_sol_sbc) VALUES (id_veiculo_mccarthy_1, 'htps://sol.com/aaai');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_mccarthy_1, id_area_comp);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_mccarthy, NOW() - INTERVAL '22 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_mccarthy_1);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_auditor_3, NOW() - INTERVAL '21 day', 'cadastro_veiculo_aceito');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_mccarthy_1);

INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES (id_veiculo_mccarthy_2, id_pesq_mccarthy, 'Journal of Artificial Intelligence Research (JAIR)', 'a1', 'vinculo_top_10', 'doutorado', 'periodico', 'aceito');
INSERT INTO Periodico (id_veiculo, ISSN, percentil_jcr, link_jcr) VALUES (id_veiculo_mccarthy_2, '89898989', 34, 'http://jcr.com/taocp');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_mccarthy_2, id_area_comp);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_mccarthy, NOW() - INTERVAL '28 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_mccarthy_2);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_auditor_4, NOW() - INTERVAL '26 day', 'cadastro_veiculo_aceito');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_mccarthy_2);

INSERT INTO VeiculoPublicacao (id_veiculo, id_usuario, nome, h5, link_google_scholar, classificacao, vinculo_sbc, adequado_defesa, tipo, status)
VALUES (id_veiculo_mccarthy_3, id_pesq_mccarthy, 'LISP and Functional Programming Symposium', 10, 'http://lfp-symp.historic', 'a5', 'sem_vinculo', 'nenhum', 'evento', 'negado');
    INSERT INTO Evento (id_veiculo, link_sol_sbc) VALUES (id_veiculo_mccarthy_3, 'htps://sol.com/aaai');
INSERT INTO AreaPesquisaVeiculo (id_veiculo, id_area_pesquisa) VALUES (id_veiculo_mccarthy_3, id_area_comp);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_pesq_mccarthy, NOW() - INTERVAL '12 day', 'adicao_veiculo');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_mccarthy_3);
log_id := gen_random_uuid();
INSERT INTO Log (id_log, id_usuario, data_hora, acao) VALUES (log_id, id_usuario_auditor, NOW() - INTERVAL '11 day', 'cadastro_veiculo_recusado');
INSERT INTO LogVeiculo (id_log, id_veiculo) VALUES (log_id, id_veiculo_mccarthy_3);
INSERT INTO JustificativaRecusa (id_log, justificativa) VALUES (log_id, 'Evento histórico sem edições recentes e com classificação não adequada para defesa de mestrado ou doutorado.');


RAISE NOTICE 'Inserção massiva de dados concluída com sucesso!';

END $$;
