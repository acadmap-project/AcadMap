package com.acadmap.specification;

import com.acadmap.model.dto.veiculo.FiltroVeiculoRequestDTO;
import com.acadmap.model.entities.VeiculoPublicacao;
import com.acadmap.model.enums.AdequacaoDefesa;
import com.acadmap.model.enums.ClassificacaoVeiculo;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.model.enums.VinculoSBC;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class VeiculoSpecification {

    // Lista ordenada para o filtro de classificação mínima
    private static final List<ClassificacaoVeiculo> CLASSIFICACAO_ORDER = Arrays.asList(
            ClassificacaoVeiculo.a8, ClassificacaoVeiculo.a7, ClassificacaoVeiculo.a6,
            ClassificacaoVeiculo.a5, ClassificacaoVeiculo.a4, ClassificacaoVeiculo.a3,
            ClassificacaoVeiculo.a2, ClassificacaoVeiculo.a1
    );

    public <T extends VeiculoPublicacao> Specification<T> getSpecification(FiltroVeiculoRequestDTO filtro) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtro base para status "aceito" sempre aplicado
            predicates.add(criteriaBuilder.equal(root.get("status"), StatusVeiculo.aceito));

            List<Predicate> filtroPredicates = new ArrayList<>();

            // --- Lógica de Filtros ---

            if (filtro.getNome() != null && !filtro.getNome().trim().isEmpty()) {
                filtroPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("nome")), "%" + filtro.getNome().toLowerCase() + "%"));
            }

            if (filtro.getAreasPesquisaIds() != null && !filtro.getAreasPesquisaIds().isEmpty()) {
                // O 'join' é usado para fazer a ligação com a tabela de relacionamento
                filtroPredicates.add(root.join("areasPesquisa").get("idAreaPesquisa").in(filtro.getAreasPesquisaIds()));
            }

            if (filtro.getAreasPesquisaNomes() != null && !filtro.getAreasPesquisaNomes().isEmpty()) {
                // O 'join' cria a ligação com a tabela de AreaPesquisa
                // A cláusula 'in' verifica se o nome da área está na lista fornecida
                filtroPredicates.add(root.join("areasPesquisa").get("nome").in(filtro.getAreasPesquisaNomes()));
            } else if (filtro.getAreasPesquisaIds() != null && !filtro.getAreasPesquisaIds().isEmpty()) {
                filtroPredicates.add(root.join("areasPesquisa").get("idAreaPesquisa").in(filtro.getAreasPesquisaIds()));
            }

            if (filtro.getVinculoSbc() != null) {
                if (filtro.getVinculoSbc()) {
                    // Se vinculoSbc for true, busca todos que NÃO são "sem_vinculo"
                    filtroPredicates.add(criteriaBuilder.notEqual(root.get("vinculoSbc"), VinculoSBC.sem_vinculo));
                } else {
                    // Se for false, busca apenas os que são "sem_vinculo"
                    filtroPredicates.add(criteriaBuilder.equal(root.get("vinculoSbc"), VinculoSBC.sem_vinculo));
                }
            }

            if (filtro.getAdequacaoDefesa() != null && !filtro.getAdequacaoDefesa().isEmpty()) {
                Set<AdequacaoDefesa> adequacoes = new HashSet<>(filtro.getAdequacaoDefesa());
                // Se o filtro inclui mestrado ou doutorado, também devemos incluir "mestrado_doutorado"
                if (adequacoes.contains(AdequacaoDefesa.mestrado) || adequacoes.contains(AdequacaoDefesa.doutorado)) {
                    adequacoes.add(AdequacaoDefesa.mestrado_doutorado);
                }
                filtroPredicates.add(root.get("adequadoDefesa").in(adequacoes));
            }

            if (filtro.getH5Minimo() != null) {
                filtroPredicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("h5"), filtro.getH5Minimo()));
            }

            if (filtro.getClassificacaoMinima() != null) {
                int index = CLASSIFICACAO_ORDER.indexOf(filtro.getClassificacaoMinima());
                if (index != -1) {
                    List<ClassificacaoVeiculo> classificacoesValidas = CLASSIFICACAO_ORDER.subList(index, CLASSIFICACAO_ORDER.size());
                    filtroPredicates.add(root.get("classificacao").in(classificacoesValidas));
                }
            }

            // --- Combinação dos Predicados ---
            if (!filtroPredicates.isEmpty()) {
                Predicate combinedFilters;
                if (filtro.isCorrespondenciaExata()) { // Lógica AND
                    combinedFilters = criteriaBuilder.and(filtroPredicates.toArray(new Predicate[0]));
                } else { // Lógica OR
                    combinedFilters = criteriaBuilder.or(filtroPredicates.toArray(new Predicate[0]));
                }
                predicates.add(combinedFilters);
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}