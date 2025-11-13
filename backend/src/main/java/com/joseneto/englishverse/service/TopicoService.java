package com.joseneto.englishverse.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.model.Topico;
import com.joseneto.englishverse.repository.TopicoRepository;

@Service
public class TopicoService {
    @Autowired
    private TopicoRepository topicoRepository;

    public List<Topico> listarTodos() {
        return topicoRepository.findAll();
    }

    public Optional<Topico> buscarPorId(Long id) {
        return topicoRepository.findById(id);
    }

    public Topico salvar(Topico topico) {
        // Regra: Não pode ter dois tópicos com o mesmo nome
        return topicoRepository.save(topico);
    }

    public Topico atualizar(Long id, Topico topicoAtualizado) {
        return topicoRepository.findById(id)
                .map(topicoExistente -> {
                    topicoExistente.setNome(topicoAtualizado.getNome());
                    topicoExistente.setDescricao(topicoAtualizado.getDescricao());
                    return topicoRepository.save(topicoExistente);
                })
                .orElseThrow(() -> new RuntimeException("Tópico não encontrado, meu vey!"));
    }

    public void deletar(Long id) {
        // Futuramente, aqui tu vai ter que checar se o tópico tem Módulos antes de deletar
        // pra não deixar módulo órfão. Por enquanto, segue o baile.
        topicoRepository.deleteById(id);
    }
}
