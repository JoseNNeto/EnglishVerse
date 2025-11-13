package com.joseneto.englishverse.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.model.ProductionChallenge;
import com.joseneto.englishverse.repository.ModuloRepository;
import com.joseneto.englishverse.repository.ProductionChallengeRepository;

@Service
public class ProductionChallengeService {
    @Autowired
    private ProductionChallengeRepository repository;

    @Autowired
    private ModuloRepository moduloRepository;

    public List<ProductionChallenge> listarPorModulo(Long moduloId) {
        return repository.findByModuloId(moduloId);
    }

    public Optional<ProductionChallenge> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public ProductionChallenge salvar(ProductionChallenge challenge) {
        // Validação: Módulo existe?
        if (challenge.getModulo() == null || challenge.getModulo().getId() == null) {
            throw new RuntimeException("Oxe, esse desafio é de qual módulo?");
        }

        if (!moduloRepository.existsById(challenge.getModulo().getId())) {
            throw new RuntimeException("Módulo não encontrado!");
        }
        
        // Aqui tu poderia validar o JSON dependendo do tipo, mas deixa flexível por enquanto.
        return repository.save(challenge);
    }

    public ProductionChallenge atualizar(Long id, ProductionChallenge atualizado) {
        return repository.findById(id)
            .map(existente -> {
                existente.setTipoDesafio(atualizado.getTipoDesafio());
                existente.setInstrucaoDesafio(atualizado.getInstrucaoDesafio());
                existente.setMidiaDesafioUrl(atualizado.getMidiaDesafioUrl());
                existente.setDadosDesafio(atualizado.getDadosDesafio()); // Atualiza o JSON
                
                return repository.save(existente);
            }).orElseThrow(() -> new RuntimeException("Desafio não encontrado!"));
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
