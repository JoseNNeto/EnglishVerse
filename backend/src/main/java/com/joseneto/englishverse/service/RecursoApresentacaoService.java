package com.joseneto.englishverse.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.model.RecursoApresentacao;
import com.joseneto.englishverse.repository.ModuloRepository;
import com.joseneto.englishverse.repository.RecursoApresentacaoRepository;

@Service
public class RecursoApresentacaoService {
    @Autowired
    private RecursoApresentacaoRepository recursoRepository;

    @Autowired
    private ModuloRepository moduloRepository;

    public List<RecursoApresentacao> listarPorModulo(Long moduloId) {
        return recursoRepository.findByModuloIdOrderByOrdemAsc(moduloId);
    }

    public Optional<RecursoApresentacao> buscarPorId(Long id) {
        return recursoRepository.findById(id);
    }

    public RecursoApresentacao salvar(RecursoApresentacao recurso) {
        // Validação: O módulo existe?
        if (recurso.getModulo() == null || recurso.getModulo().getId() == null) {
            throw new RuntimeException("Esse recurso pertence a qual módulo, boy?");
        }

        if (!moduloRepository.existsById(recurso.getModulo().getId())) {
            throw new RuntimeException("Módulo não encontrado!");
        }

        return recursoRepository.save(recurso);
    }

    public RecursoApresentacao atualizar(Long id, RecursoApresentacao recursoAtualizado) {
        return recursoRepository.findById(id)
            .map(recursoExistente -> {
                recursoExistente.setTipoRecurso(recursoAtualizado.getTipoRecurso());
                recursoExistente.setUrlRecurso(recursoAtualizado.getUrlRecurso());
                recursoExistente.setTranscricao(recursoAtualizado.getTranscricao());
                recursoExistente.setOrdem(recursoAtualizado.getOrdem());
                
                return recursoRepository.save(recursoExistente);
            }).orElseThrow(() -> new RuntimeException("Recurso não encontrado!"));
    }

    public void deletar(Long id) {
        recursoRepository.deleteById(id);
    }
}
