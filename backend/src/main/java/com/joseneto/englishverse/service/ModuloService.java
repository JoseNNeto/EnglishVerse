package com.joseneto.englishverse.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.model.Modulo;
import com.joseneto.englishverse.repository.ModuloRepository;
import com.joseneto.englishverse.repository.TopicoRepository;

@Service
public class ModuloService {
    @Autowired
    private ModuloRepository moduloRepository;

    @Autowired
    private TopicoRepository topicoRepository;

    public List<Modulo> listarTodos() {
        return moduloRepository.findAll();
    }
    
    // Método extra pra facilitar tua vida no Front-end
    public List<Modulo> listarPorTopico(Long topicoId) {
        return moduloRepository.findByTopicoId(topicoId);
    }

    public Optional<Modulo> buscarPorId(Long id) {
        return moduloRepository.findById(id);
    }

    public Modulo salvar(Modulo modulo) {
        // Validação: O Tópico informado existe?
        // O Java espera receber o objeto Topico com pelo menos o ID preenchido
        if (modulo.getTopico() == null || modulo.getTopico().getId() == null) {
             throw new RuntimeException("Oxe, cadê o tópico desse módulo?");
        }
        
        // Verifica se o ID do tópico é válido no banco
        if (!topicoRepository.existsById(modulo.getTopico().getId())) {
            throw new RuntimeException("Tópico não encontrado, boy!");
        }

        return moduloRepository.save(modulo);
    }

    public Modulo atualizar(Long id, Modulo moduloAtualizado) {
        return moduloRepository.findById(id)
            .map(moduloExistente -> {
                moduloExistente.setTitulo(moduloAtualizado.getTitulo());
                moduloExistente.setDescricao(moduloAtualizado.getDescricao());
                moduloExistente.setImagemCapaUrl(moduloAtualizado.getImagemCapaUrl());
                moduloExistente.setPublicado(moduloAtualizado.getPublicado());
                
                // Se quiser mudar o módulo de tópico, tem que validar de novo
                if (moduloAtualizado.getTopico() != null) {
                     // Aqui tu poderia validar se o novo tópico existe também
                     moduloExistente.setTopico(moduloAtualizado.getTopico());
                }
                
                return moduloRepository.save(moduloExistente);
            }).orElseThrow(() -> new RuntimeException("Módulo sumiu, visse?"));
    }

    public void deletar(Long id) {
        moduloRepository.deleteById(id);
    }

    public List<Modulo> buscarPorTitulo(String titulo) {
        return moduloRepository.findByTituloContainingIgnoreCase(titulo);
    }
}
