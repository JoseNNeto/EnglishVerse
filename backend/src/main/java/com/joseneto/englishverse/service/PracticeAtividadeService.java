package com.joseneto.englishverse.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.model.PracticeAtividade;
import com.joseneto.englishverse.repository.ModuloRepository;
import com.joseneto.englishverse.repository.PracticeAtividadeRepository;

@Service
public class PracticeAtividadeService {
    @Autowired
    private PracticeAtividadeRepository repository;

    @Autowired
    private ModuloRepository moduloRepository;

    public List<PracticeAtividade> listarPorModulo(Long moduloId) {
        return repository.findByModuloId(moduloId);
    }

    public Optional<PracticeAtividade> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public PracticeAtividade salvar(PracticeAtividade atividade) {
        // Validação: Tem módulo?
        if (atividade.getModulo() == null || atividade.getModulo().getId() == null) {
            throw new RuntimeException("Oxe, essa atividade é de qual módulo, boy?");
        }

        if (!moduloRepository.existsById(atividade.getModulo().getId())) {
            throw new RuntimeException("Módulo não encontrado!");
        }

        return repository.save(atividade);
    }

    public PracticeAtividade atualizar(Long id, PracticeAtividade atualizada) {
        return repository.findById(id)
            .map(existente -> {
                existente.setTipoAtividade(atualizada.getTipoAtividade());
                existente.setInstrucao(atualizada.getInstrucao());
                existente.setDadosAtividade(atualizada.getDadosAtividade()); // Atualiza o JSON
                
                return repository.save(existente);
            }).orElseThrow(() -> new RuntimeException("Atividade não encontrada!"));
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
