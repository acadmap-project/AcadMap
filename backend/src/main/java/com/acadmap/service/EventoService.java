package com.acadmap.service;

import com.acadmap.exception.EventoDuplicadoException;
import com.acadmap.model.dto.EventoCreateDTO;
import com.acadmap.model.entities.*;
import com.acadmap.model.enums.AcaoLog;
import com.acadmap.model.enums.StatusVeiculo;
import com.acadmap.model.enums.TipoVeiculo;
import com.acadmap.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.GeneratedValue;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@AllArgsConstructor
public class EventoService {

  private final AreaPesquisaRepository areaPesquisaRepository;
  private final EventoRepository eventoRepository;
  private final UsuarioRepository usuarioRepository;
  private final ProgramaRepository programaRepository;
  private final LogRepository logRepository;


  @Transactional
  public Evento criarEvento(EventoCreateDTO dto, UUID uuid) {
    try {
      // 🔍 Verificar duplicidade por nome aproximado
      List<Evento> eventosSimilares =
          this.eventoRepository.findByNomeContainingIgnoreCase(dto.getNome());
      if (!eventosSimilares.isEmpty()) {
        throw new EventoDuplicadoException("Erro de duplicidade de evento detectado.",
            eventosSimilares);
      }

      Set<AreaPesquisa> areasPesquisa = this.carregarAreasPesquisa(dto.getAreasPesquisaIds());

      Evento evento = new Evento();
      evento.setIdVeiculo(UUID.randomUUID());
      evento.setAdequadoDefesa(dto.getAdequadoDefesa());
      evento.setClassificacao(dto.getClassificacao());
      evento.setNome(dto.getNome());
      evento.setVinculoSbc(dto.getVinculoSbc());
      evento.setTipo(TipoVeiculo.evento);
      evento.setStatus(dto.getStatus() != null ? dto.getStatus() : StatusVeiculo.pendente);
      evento.setAreasPesquisa(areasPesquisa);
      Usuario usuario = usuarioRepository.findByIdAndFetchProgramaEagerly(uuid).orElseThrow(EntityNotFoundException::new);
      evento.setUsuario(usuario);

      evento.setH5(dto.getH5());
      evento.setLinkEvento(dto.getLinkEvento());
      evento.setLinkGoogleScholar(dto.getLinkGoogleScholar());
      evento.setLinkSolSbc(dto.getLinkSolSbc());


      Evento eventoSalvo =  this.eventoRepository.save(evento);

      LogVeiculo log = new LogVeiculo();
      log.setIdLog(UUID.randomUUID());
      log.setUsuario(usuario);
      log.setDataHora(LocalDateTime.now());
      log.setAcao(AcaoLog.adicao_veiculo);

      logRepository.save(log);

      eventoSalvo.getLogsVeiculo().add(log);

      return eventoSalvo;


    } catch (EventoDuplicadoException e) {
      throw e;
    } catch (IllegalArgumentException e) {
      throw new RuntimeException("Erro de validação: " + e.getMessage());
    } catch (DataAccessException e) {
      throw new RuntimeException("Erro ao acessar o banco de dados: " + e.getMessage());
    } catch (Exception e) {
      throw new RuntimeException("Erro inesperado ao criar evento: " + e.getMessage());
    }
  }

  private Set<AreaPesquisa> carregarAreasPesquisa(Set<UUID> idsAreasPesquisa) {
    if (idsAreasPesquisa == null || idsAreasPesquisa.isEmpty()) {
      return new HashSet<>();
    }

    List<AreaPesquisa> areas = this.areaPesquisaRepository.findAllById(idsAreasPesquisa);

    if (areas.size() != idsAreasPesquisa.size()) {
      throw new IllegalArgumentException("Uma ou mais áreas de pesquisa não foram encontradas.");
    }

    return new HashSet<>(areas);
  }
}
