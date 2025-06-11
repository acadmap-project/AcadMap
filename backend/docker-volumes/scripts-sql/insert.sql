-- Inserções para a tabela AreaPesquisa
INSERT INTO AreaPesquisa (id_area_pesquisa, nome) 
VALUES 
(gen_random_uuid(), 'Matemática'),
(gen_random_uuid(), 'Probabilidade e Estatística'),
(gen_random_uuid(), 'Ciência da Computação'),
(gen_random_uuid(), 'Astronomia'),
(gen_random_uuid(), 'Física'),
(gen_random_uuid(), 'Química'),
(gen_random_uuid(), 'Geociências'),
(gen_random_uuid(), 'Oceanografia'),
(gen_random_uuid(), 'Biologia Geral'),
(gen_random_uuid(), 'Genética'),
(gen_random_uuid(), 'Botânica'),
(gen_random_uuid(), 'Zoologia'),
(gen_random_uuid(), 'Ecologia'),
(gen_random_uuid(), 'Morfologia'),
(gen_random_uuid(), 'Fisiologia'),
(gen_random_uuid(), 'Bioquímica'),
(gen_random_uuid(), 'Biofísica'),
(gen_random_uuid(), 'Farmacologia'),
(gen_random_uuid(), 'Imunologia'),
(gen_random_uuid(), 'Microbiologia'),
(gen_random_uuid(), 'Parasitologia'),
(gen_random_uuid(), 'Engenharia Civil'),
(gen_random_uuid(), 'Engenharia de Minas'),
(gen_random_uuid(), 'Engenharia de Materiais e Metalúrgica'),
(gen_random_uuid(), 'Engenharia Elétrica'),
(gen_random_uuid(), 'Engenharia Mecânica'),
(gen_random_uuid(), 'Engenharia Química'),
(gen_random_uuid(), 'Engenharia Sanitária'),
(gen_random_uuid(), 'Engenharia de Produção'),
(gen_random_uuid(), 'Engenharia Nuclear'),
(gen_random_uuid(), 'Engenharia de Transportes'),
(gen_random_uuid(), 'Engenharia Naval e Oceânica'),
(gen_random_uuid(), 'Engenharia Aeroespacial'),
(gen_random_uuid(), 'Engenharia Biomédica'),
(gen_random_uuid(), 'Engenharia Agrícola'), -- Nota: Aparece duas vezes na sua lista, inserindo uma vez.
(gen_random_uuid(), 'Medicina'),
(gen_random_uuid(), 'Odontologia'),
(gen_random_uuid(), 'Farmácia'),
(gen_random_uuid(), 'Enfermagem'),
(gen_random_uuid(), 'Nutrição'),
(gen_random_uuid(), 'Saúde Coletiva'),
(gen_random_uuid(), 'Fonoaudiologia'),
(gen_random_uuid(), 'Fisioterapia e Terapia Ocupacional'),
(gen_random_uuid(), 'Educação Física'),
(gen_random_uuid(), 'Agronomia'),
(gen_random_uuid(), 'Recursos Florestais e Engenharia Florestal'),
(gen_random_uuid(), 'Zootecnia'),
(gen_random_uuid(), 'Medicina Veterinária'),
(gen_random_uuid(), 'Recursos Pesqueiros e Engenharia de Pesca'),
(gen_random_uuid(), 'Ciência e Tecnologia de Alimentos'),
(gen_random_uuid(), 'Direito'),
(gen_random_uuid(), 'Administração'),
(gen_random_uuid(), 'Economia'),
(gen_random_uuid(), 'Arquitetura e Urbanismo'),
(gen_random_uuid(), 'Planejamento Urbano e Regional'),
(gen_random_uuid(), 'Demografia'),
(gen_random_uuid(), 'Ciência da Informação'),
(gen_random_uuid(), 'Comunicação'),
(gen_random_uuid(), 'Serviço Social'),
(gen_random_uuid(), 'Economia Doméstica'),
(gen_random_uuid(), 'Turismo'),
(gen_random_uuid(), 'Desenho Industrial'),
(gen_random_uuid(), 'Filosofia'),
(gen_random_uuid(), 'Sociologia'),
(gen_random_uuid(), 'Antropologia e Arqueologia'),
(gen_random_uuid(), 'História'),
(gen_random_uuid(), 'Geografia'),
(gen_random_uuid(), 'Psicologia'),
(gen_random_uuid(), 'Educação'),
(gen_random_uuid(), 'Ciência Política'),
(gen_random_uuid(), 'Teologia'),
(gen_random_uuid(), 'Linguística'),
(gen_random_uuid(), 'Letras'),
(gen_random_uuid(), 'Artes');

-- INSERT PROGRAMA
INSERT INTO public.programa (id_programa, nome) VALUES
('1a2b3c4d-5e6f-7081-91a2-b3c4d5e6f701', 'Programa de Saúde da Família'),
('2b3c4d5e-6f70-8191-a2b3-c4d5e6f70812', 'Programa de Alfabetização Infantil'),
('3c4d5e6f-7081-91a2-b3c4-d5e6f7081234', 'Programa de Energia Renovável'),
('4d5e6f70-8191-a2b3-c4d5-e6f708123456', 'Programa de Inclusão Digital'),
('5e6f7081-91a2-b3c4-d5e6-f70812345678', 'Programa Nacional de Vacinação'),
('6f708191-a2b3-c4d5-e6f7-081234567890', 'Programa de Combate à Fome'),
('708191a2-b3c4-d5e6-f708-1234567890ab', 'Programa de Agricultura Sustentável'),
('8191a2b3-c4d5-e6f7-0812-34567890abcd', 'Programa de Incentivo à Leitura'),
('91a2b3c4-d5e6-f708-1234-567890abcde1', 'Programa de Moradia Popular'),
('a2b3c4d5-e6f7-0812-3456-7890abcdef12', 'Programa de Apoio à Juventude'),
('b3c4d5e6-f708-1234-5678-90abcdef1234', 'Programa de Educação Ambiental'),
('c4d5e6f7-0812-3456-7890-abcdef123456', 'Programa de Desenvolvimento Rural'),
('d5e6f708-1234-5678-90ab-cdef12345678', 'Programa de Cultura para Todos'),
('e6f70812-3456-7890-abcd-ef1234567890', 'Programa de Acesso à Internet'),
('f7081234-5678-90ab-cdef-1234567890ab', 'Programa de Formação Técnica'),
('08123456-7890-abcd-ef12-34567890abcd', 'Programa de Economia Solidária'),
('12345678-90ab-cdef-1234-567890abcdef', 'Programa de Reflorestamento Urbano'),
('23456789-0abc-def1-2345-67890abcdef1', 'Programa de Valorização da Mulher'),
('34567890-abcd-ef12-3456-7890abcdef12', 'Programa de Apoio ao Microempreendedor'),
('4567890a-bcde-f123-4567-890abcdef123', 'Programa de Transporte Sustentável');


-- INSERT USUÁRIO
INSERT INTO public.usuario (id_usuario, id_programa, nome, email, senha, tipo_perfil, flag_ativo) VALUES
('11111111-aaaa-bbbb-cccc-000000000001', '1a2b3c4d-5e6f-7081-91a2-b3c4d5e6f701', 'João Silva', 'joao.silva@saude.gov', 'senha123', 'administrador', true),
('11111111-aaaa-bbbb-cccc-000000000002', '1a2b3c4d-5e6f-7081-91a2-b3c4d5e6f701', 'Maria Souza', 'maria.souza@saude.gov', 'senha123', 'auditor', true),
('11111111-aaaa-bbbb-cccc-000000000003', '1a2b3c4d-5e6f-7081-91a2-b3c4d5e6f701', 'Carlos Lima', 'carlos.lima@saude.gov', 'senha123', 'pesquisador', true),
('11111111-aaaa-bbbb-cccc-000000000004', '2b3c4d5e-6f70-8191-a2b3-c4d5e6f70812', 'Ana Paula', 'ana.paula@educa.gov', 'senha123', 'administrador', true),
('11111111-aaaa-bbbb-cccc-000000000005', '2b3c4d5e-6f70-8191-a2b3-c4d5e6f70812', 'Eduardo Nunes', 'eduardo.nunes@educa.gov', 'senha123', 'auditor', true),
('11111111-aaaa-bbbb-cccc-000000000006', '2b3c4d5e-6f70-8191-a2b3-c4d5e6f70812', 'Fernanda Costa', 'fernanda.costa@educa.gov', 'senha123', 'pesquisador', true),
('11111111-aaaa-bbbb-cccc-000000000007', '3c4d5e6f-7081-91a2-b3c4-d5e6f7081234', 'Ricardo Alves', 'ricardo.alves@energia.gov', 'senha123', 'administrador', true),
('11111111-aaaa-bbbb-cccc-000000000008', '3c4d5e6f-7081-91a2-b3c4-d5e6f7081234', 'Juliana Rocha', 'juliana.rocha@energia.gov', 'senha123', 'auditor', true),
('11111111-aaaa-bbbb-cccc-000000000009', '3c4d5e6f-7081-91a2-b3c4-d5e6f7081234', 'Bruno Teixeira', 'bruno.teixeira@energia.gov', 'senha123', 'pesquisador', true),
('11111111-aaaa-bbbb-cccc-000000000010', '4d5e6f70-8191-a2b3-c4d5-e6f708123456', 'Patrícia Gomes', 'patricia.gomes@digital.gov', 'senha123', 'administrador', true),
('11111111-aaaa-bbbb-cccc-000000000011', '4d5e6f70-8191-a2b3-c4d5-e6f708123456', 'Daniel Ramos', 'daniel.ramos@digital.gov', 'senha123', 'auditor', true),
('11111111-aaaa-bbbb-cccc-000000000012', '4d5e6f70-8191-a2b3-c4d5-e6f708123456', 'Larissa Mendes', 'larissa.mendes@digital.gov', 'senha123', 'pesquisador', true),
('11111111-aaaa-bbbb-cccc-000000000013', '5e6f7081-91a2-b3c4-d5e6-f70812345678', 'Pedro Martins', 'pedro.martins@vacinas.gov', 'senha123', 'administrador', true),
('11111111-aaaa-bbbb-cccc-000000000014', '5e6f7081-91a2-b3c4-d5e6-f70812345678', 'Bianca Dias', 'bianca.dias@vacinas.gov', 'senha123', 'auditor', true),
('11111111-aaaa-bbbb-cccc-000000000015', '5e6f7081-91a2-b3c4-d5e6-f70812345678', 'Thiago Pinto', 'thiago.pinto@vacinas.gov', 'senha123', 'pesquisador', true),
('11111111-aaaa-bbbb-cccc-000000000016', '6f708191-a2b3-c4d5-e6f7-081234567890', 'Camila Ribeiro', 'camila.ribeiro@fome.gov', 'senha123', 'administrador', true),
('11111111-aaaa-bbbb-cccc-000000000017', '6f708191-a2b3-c4d5-e6f7-081234567890', 'Marcos Freitas', 'marcos.freitas@fome.gov', 'senha123', 'auditor', true),
('11111111-aaaa-bbbb-cccc-000000000018', '6f708191-a2b3-c4d5-e6f7-081234567890', 'Helena Duarte', 'helena.duarte@fome.gov', 'senha123', 'pesquisador', true),
('11111111-aaaa-bbbb-cccc-000000000019', '708191a2-b3c4-d5e6-f708-1234567890ab', 'Joana Tavares', 'joana.tavares@agro.gov', 'senha123', 'administrador', true),
('11111111-aaaa-bbbb-cccc-000000000020', '708191a2-b3c4-d5e6-f708-1234567890ab', 'Rodrigo Castro', 'rodrigo.castro@agro.gov', 'senha123', 'auditor', true),
('11111111-aaaa-bbbb-cccc-000000000021', '708191a2-b3c4-d5e6-f708-1234567890ab', 'Simone Melo', 'simone.melo@agro.gov', 'senha123', 'pesquisador', true),
('11111111-aaaa-bbbb-cccc-000000000022', '8191a2b3-c4d5-e6f7-0812-34567890abcd', 'Leandro Torres', 'leandro.torres@leitura.gov', 'senha123', 'administrador', true),
('11111111-aaaa-bbbb-cccc-000000000023', '8191a2b3-c4d5-e6f7-0812-34567890abcd', 'Tatiane Viana', 'tatiane.viana@leitura.gov', 'senha123', 'auditor', true),
('11111111-aaaa-bbbb-cccc-000000000024', '8191a2b3-c4d5-e6f7-0812-34567890abcd', 'Alex Barreto', 'alex.barreto@leitura.gov', 'senha123', 'pesquisador', true),
('11111111-aaaa-bbbb-cccc-000000000025', '91a2b3c4-d5e6-f708-1234-567890abcde1', 'Débora Lopes', 'debora.lopes@moradia.gov', 'senha123', 'administrador', true),
('11111111-aaaa-bbbb-cccc-000000000026', '91a2b3c4-d5e6-f708-1234-567890abcde1', 'Rafael Queiroz', 'rafael.queiroz@moradia.gov', 'senha123', 'auditor', true),
('11111111-aaaa-bbbb-cccc-000000000027', '91a2b3c4-d5e6-f708-1234-567890abcde1', 'Isabela Neves', 'isabela.neves@moradia.gov', 'senha123', 'pesquisador', true),
('11111111-aaaa-bbbb-cccc-000000000028', 'a2b3c4d5-e6f7-0812-3456-7890abcdef12', 'Douglas Silva', 'douglas.silva@juventude.gov', 'senha123', 'administrador', true),
('11111111-aaaa-bbbb-cccc-000000000029', 'a2b3c4d5-e6f7-0812-3456-7890abcdef12', 'Renata Lima', 'renata.lima@juventude.gov', 'senha123', 'auditor', true),
('11111111-aaaa-bbbb-cccc-000000000030', 'a2b3c4d5-e6f7-0812-3456-7890abcdef12', 'Vinícius Costa', 'vinicius.costa@juventude.gov', 'senha123', 'pesquisador', true),
('11111111-aaaa-bbbb-cccc-000000000031', 'b3c4d5e6-f708-1234-5678-90abcdef1234', 'Marina Rocha', 'marina.rocha@ambiental.gov', 'senha123', 'administrador', true),
('11111111-aaaa-bbbb-cccc-000000000032', 'b3c4d5e6-f708-1234-5678-90abcdef1234', 'Otávio Silva', 'otavio.silva@ambiental.gov', 'senha123', 'auditor', true),
('11111111-aaaa-bbbb-cccc-000000000033', 'b3c4d5e6-f708-1234-5678-90abcdef1234', 'Alessandra Moraes', 'alessandra.moraes@ambiental.gov', 'senha123', 'pesquisador', true),
('11111111-aaaa-bbbb-cccc-000000000034', 'c4d5e6f7-0812-3456-7890-abcdef123456', 'Felipe Gonçalves', 'felipe.goncalves@rural.gov', 'senha123', 'administrador', true),
('11111111-aaaa-bbbb-cccc-000000000035', 'c4d5e6f7-0812-3456-7890-abcdef123456', 'Cristiane Leal', 'cristiane.leal@rural.gov', 'senha123', 'auditor', true),
('11111111-aaaa-bbbb-cccc-000000000036', 'c4d5e6f7-0812-3456-7890-abcdef123456', 'Marcelo Bittencourt', 'marcelo.bittencourt@rural.gov', 'senha123', 'pesquisador', true);



-- INSERT VEICULO E EVENTO
INSERT INTO public.veiculopublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES
('00000000-aaaa-bbbb-cccc-000000000001', '11111111-aaaa-bbbb-cccc-000000000001', 'Congresso Nacional de Computação', 'a1', 'vinculo_top_10', 'mestrado', 'evento', 'aceito');
INSERT INTO public.evento (id_veiculo, h5, link_evento, link_google_scholar, link_sol_sbc) VALUES
('00000000-aaaa-bbbb-cccc-000000000001', 25, 'https://evento1.com', 'https://scholar.google.com/evento1', 'https://sol.sbc.org.br/evento1');
INSERT INTO public.veiculopublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES
('00000000-aaaa-bbbb-cccc-000000000002', '11111111-aaaa-bbbb-cccc-000000000002', 'Simpósio Latino-Americano de Software', 'a3', 'vinculo_top_20', 'mestrado_doutorado', 'evento', 'pendente');
INSERT INTO public.evento (id_veiculo, h5, link_evento, link_google_scholar, link_sol_sbc) VALUES
('00000000-aaaa-bbbb-cccc-000000000002', 30, 'https://evento2.com', 'https://scholar.google.com/evento2', 'https://sol.sbc.org.br/evento2');
INSERT INTO public.veiculopublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES
('00000000-aaaa-bbbb-cccc-000000000003', '11111111-aaaa-bbbb-cccc-000000000003', 'Workshop de Inteligência Artificial', 'a2', 'sem_vinculo', 'nenhum', 'evento', 'aceito');
INSERT INTO public.evento (id_veiculo, h5, link_evento, link_google_scholar, link_sol_sbc) VALUES
('00000000-aaaa-bbbb-cccc-000000000003', 18, 'https://evento3.com', 'https://scholar.google.com/evento3', 'https://sol.sbc.org.br/evento3');
INSERT INTO public.veiculopublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES
('00000000-aaaa-bbbb-cccc-000000000004', '11111111-aaaa-bbbb-cccc-000000000004', 'Encontro Brasileiro de Robótica', 'a4', 'vinculo_comum', 'doutorado', 'evento', 'negado');
INSERT INTO public.evento (id_veiculo, h5, link_evento, link_google_scholar, link_sol_sbc) VALUES
('00000000-aaaa-bbbb-cccc-000000000004', 10, 'https://evento4.com', 'https://scholar.google.com/evento4', 'https://sol.sbc.org.br/evento4');
INSERT INTO public.veiculopublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES
('00000000-aaaa-bbbb-cccc-000000000005', '11111111-aaaa-bbbb-cccc-000000000005', 'Fórum Nacional de Computação', 'a5', 'vinculo_top_10', 'mestrado_doutorado', 'evento', 'aceito');
INSERT INTO public.evento (id_veiculo, h5, link_evento, link_google_scholar, link_sol_sbc) VALUES
('00000000-aaaa-bbbb-cccc-000000000005', 50, 'https://evento5.com', 'https://scholar.google.com/evento5', 'https://sol.sbc.org.br/evento5');
INSERT INTO public.veiculopublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES
('00000000-aaaa-bbbb-cccc-000000000006', '11111111-aaaa-bbbb-cccc-000000000006', 'Encontro de Computação Aplicada', 'a6', 'sem_vinculo', 'mestrado', 'evento', 'pendente');
INSERT INTO public.evento (id_veiculo, h5, link_evento, link_google_scholar, link_sol_sbc) VALUES
('00000000-aaaa-bbbb-cccc-000000000006', 16, 'https://evento6.com', 'https://scholar.google.com/evento6', 'https://sol.sbc.org.br/evento6');
INSERT INTO public.veiculopublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES
('00000000-aaaa-bbbb-cccc-000000000007', '11111111-aaaa-bbbb-cccc-000000000007', 'Congresso Brasileiro de Dados', 'a7', 'vinculo_top_20', 'nenhum', 'evento', 'excluido');
INSERT INTO public.evento (id_veiculo, h5, link_evento, link_google_scholar, link_sol_sbc) VALUES
('00000000-aaaa-bbbb-cccc-000000000007', 22, 'https://evento7.com', 'https://scholar.google.com/evento7', 'https://sol.sbc.org.br/evento7');
INSERT INTO public.veiculopublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES
('00000000-aaaa-bbbb-cccc-000000000008', '11111111-aaaa-bbbb-cccc-000000000008', 'Simpósio de Sistemas Inteligentes', 'a8', 'vinculo_top_10', 'doutorado', 'evento', 'aceito');
INSERT INTO public.evento (id_veiculo, h5, link_evento, link_google_scholar, link_sol_sbc) VALUES
('00000000-aaaa-bbbb-cccc-000000000008', 28, 'https://evento8.com', 'https://scholar.google.com/evento8', 'https://sol.sbc.org.br/evento8');
INSERT INTO public.veiculopublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES
('00000000-aaaa-bbbb-cccc-000000000009', '11111111-aaaa-bbbb-cccc-000000000009', 'Encontro Nacional de TI Verde', 'a2', 'vinculo_comum', 'mestrado', 'evento', 'pendente');
INSERT INTO public.evento (id_veiculo, h5, link_evento, link_google_scholar, link_sol_sbc) VALUES
('00000000-aaaa-bbbb-cccc-000000000009', 35, 'https://evento9.com', 'https://scholar.google.com/evento9', 'https://sol.sbc.org.br/evento9');
INSERT INTO public.veiculopublicacao (id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status) VALUES
('00000000-aaaa-bbbb-cccc-000000000010', '11111111-aaaa-bbbb-cccc-000000000010', 'Colóquio de Redes Neurais', 'a1', 'sem_vinculo', 'nenhum', 'evento', 'negado');
INSERT INTO public.evento (id_veiculo, h5, link_evento, link_google_scholar, link_sol_sbc) VALUES
('00000000-aaaa-bbbb-cccc-000000000010', 12, 'https://evento10.com', 'https://scholar.google.com/evento10', 'https://sol.sbc.org.br/evento10');
INSERT INTO public.veiculopublicacao (
    id_veiculo, id_usuario, nome, classificacao, vinculo_sbc, adequado_defesa, tipo, status
) VALUES (
    '00000000-aaaa-bbbb-dddd-000000000011', '11111111-aaaa-bbbb-cccc-000000000011', 'Revista Brasileira de Computação', 'a1', 'vinculo_top_10', 'doutorado', 'periodico', 'aceito'
);
INSERT INTO public.periodico (
    id_veiculo, issn, percentil, link_jcr, link_scopus, link_google_scholar, qualis_antigo, flag_predatorio
) VALUES (
    '00000000-aaaa-bbbb-dddd-000000000011', 9, 90, 'https://jcr1.com', 'https://scopus1.com', 'https://scholar.google.com/per1', 'a1', false
);
INSERT INTO public.veiculopublicacao VALUES (
    '00000000-aaaa-bbbb-dddd-000000000012', '11111111-aaaa-bbbb-cccc-000000000012', 'Journal of Advanced Software', 'a2', 'vinculo_top_20', 'mestrado', 'periodico', 'pendente'
);
INSERT INTO public.periodico VALUES (
    '00000000-aaaa-bbbb-dddd-000000000012', 4, 75, 'https://jcr2.com', 'https://scopus2.com', 'https://scholar.google.com/per2', 'a2', false
);
INSERT INTO public.veiculopublicacao VALUES (
    '00000000-aaaa-bbbb-dddd-000000000013', '11111111-aaaa-bbbb-cccc-000000000013', 'Revista de Inteligência Artificial', 'a2', 'sem_vinculo', 'nenhum', 'periodico', 'aceito'
);
INSERT INTO public.periodico VALUES (
    '00000000-aaaa-bbbb-dddd-000000000013', 6, 85, 'https://jcr3.com', 'https://scopus3.com', 'https://scholar.google.com/per3', 'a1', false
);
INSERT INTO public.veiculopublicacao VALUES (
    '00000000-aaaa-bbbb-dddd-000000000014', '11111111-aaaa-bbbb-cccc-000000000014', 'International Journal of Big Data', 'a2', 'vinculo_comum', 'doutorado', 'periodico', 'negado'
);
INSERT INTO public.periodico VALUES (
    '00000000-aaaa-bbbb-dddd-000000000014', 8, 60, 'https://jcr4.com', 'https://scopus4.com', 'https://scholar.google.com/per4', 'b1', true
);
INSERT INTO public.veiculopublicacao VALUES (
    '00000000-aaaa-bbbb-dddd-000000000015', '11111111-aaaa-bbbb-cccc-000000000015', 'Machine Learning Journal', 'a1', 'vinculo_top_10', 'mestrado_doutorado', 'periodico', 'aceito'
);
INSERT INTO public.periodico VALUES (
    '00000000-aaaa-bbbb-dddd-000000000015', 3, 95, 'https://jcr5.com', 'https://scopus5.com', 'https://scholar.google.com/per5', 'a1', false
);
INSERT INTO public.veiculopublicacao VALUES (
    '00000000-aaaa-bbbb-dddd-000000000016', '11111111-aaaa-bbbb-cccc-000000000016', 'Revista de Redes Neurais', 'a1', 'sem_vinculo', 'mestrado', 'periodico', 'pendente'
);
INSERT INTO public.periodico VALUES (
    '00000000-aaaa-bbbb-dddd-000000000016', 2, 70, 'https://jcr6.com', 'https://scopus6.com', 'https://scholar.google.com/per6', 'b2', false
);
INSERT INTO public.veiculopublicacao VALUES (
    '00000000-aaaa-bbbb-dddd-000000000017', '11111111-aaaa-bbbb-cccc-000000000017', 'Journal of Cloud Computing', 'a8', 'vinculo_top_20', 'nenhum', 'periodico', 'aceito'
);
INSERT INTO public.periodico VALUES (
    '00000000-aaaa-bbbb-dddd-000000000017', 123, 80, 'https://jcr7.com', 'https://scopus7.com', 'https://scholar.google.com/per7', 'a2', false
);
INSERT INTO public.veiculopublicacao VALUES (
    '00000000-aaaa-bbbb-dddd-000000000018', '11111111-aaaa-bbbb-cccc-000000000018', 'Revista Brasileira de Engenharia de Software', 'a7', 'vinculo_comum', 'mestrado', 'periodico', 'excluido'
);
INSERT INTO public.periodico VALUES (
    '00000000-aaaa-bbbb-dddd-000000000018', 23, 65, 'https://jcr8.com', 'https://scopus8.com', 'https://scholar.google.com/per8', 'b3', true
);
INSERT INTO public.veiculopublicacao VALUES (
    '00000000-aaaa-bbbb-dddd-000000000019', '11111111-aaaa-bbbb-cccc-000000000019', 'Computação e Sociedade', 'a4', 'sem_vinculo', 'nenhum', 'periodico', 'negado'
);
INSERT INTO public.periodico VALUES (
    '00000000-aaaa-bbbb-dddd-000000000019', 124, 50, 'https://jcr9.com', 'https://scopus9.com', 'https://scholar.google.com/per9', 'b4', false
);
INSERT INTO public.veiculopublicacao VALUES (
    '00000000-aaaa-bbbb-dddd-000000000020', '11111111-aaaa-bbbb-cccc-000000000020', 'Journal of Programming Languages', 'a1', 'vinculo_top_10', 'doutorado', 'periodico', 'aceito'
);
INSERT INTO public.periodico VALUES (
    '00000000-aaaa-bbbb-dddd-000000000020', 4321, 88, 'https://jcr10.com', 'https://scopus10.com', 'https://scholar.google.com/per10', 'a2', false
);
