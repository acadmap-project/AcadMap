package com.acadmap.service;

import com.acadmap.exception.evento.EventoDuplicadoException;
import com.acadmap.model.dto.evento.EventoCreateDTO;
import com.acadmap.model.dto.evento.EventoResponseDTO;
import com.acadmap.model.entities.*;
import com.acadmap.model.enums.*;
import com.acadmap.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class CriarEventoService {

  private final AreaPesquisaRepository areaPesquisaRepository;
  private final EventoRepository eventoRepository;
  private final UsuarioRepository usuarioRepository;
  private final RegistrarLogService registrarLogService;



  public EventoResponseDTO criarEvento(EventoCreateDTO dto, UUID uuid, boolean forcar) {
    try {

      List<Evento> eventosSimilares = this.eventoRepository.findByNomeContainingIgnoreCase(dto.getNome());
      if (!eventosSimilares.isEmpty() && !forcar) {
        throw new EventoDuplicadoException("Erro de duplicidade de evento detectado.",
            eventosSimilares);
      }

      Set<AreaPesquisa> areasPesquisa = this.carregarAreasPesquisa(dto.getAreasPesquisaIds());

      Usuario usuario = usuarioRepository.findByIdAndFetchProgramaEagerly(uuid).orElseThrow(EntityNotFoundException::new);

      Evento eventoSalvo =  salvarEvento(dto, areasPesquisa, usuario);

      this.registrarLogService.gerarLogVeiculo(eventoSalvo, usuario, AcaoLog.adicao_veiculo);

      return new EventoResponseDTO(eventoSalvo);


    } catch (EventoDuplicadoException e) {
      throw e;
    }
    catch (IllegalArgumentException e) {
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


  private Evento salvarEvento(EventoCreateDTO dto, Set<AreaPesquisa> areasPesquisa, Usuario usuario){

    Evento evento = new Evento();
    BeanUtils.copyProperties(dto, evento, "adequadoDefesa", "tipo", "status", "areasPesquisaIds");
    evento.setAdequadoDefesa(AdequacaoDefesa.nenhum);
    evento.setTipo(TipoVeiculo.evento);
    evento.setStatus(dto.getStatus() != null ? dto.getStatus() : StatusVeiculo.pendente);
    evento.setAreasPesquisa(areasPesquisa);
    evento.setUsuario(usuario);
    return eventoRepository.save(evento);

  }
}
