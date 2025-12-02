package com.joseneto.englishverse.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.model.Modulo;
import com.joseneto.englishverse.model.ProgressoItem;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.model.enums.ItemType;
import com.joseneto.englishverse.repository.ModuloRepository;
import com.joseneto.englishverse.repository.ProgressoItemRepository;
import com.joseneto.englishverse.repository.UsuarioRepository;

@Service
public class ProgressoItemService {

    @Autowired
    private ProgressoItemRepository progressoItemRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ModuloRepository moduloRepository;

    public List<ProgressoItem> getProgressoPorModulo(Long usuarioId, Long moduloId) {
        return progressoItemRepository.findByAlunoIdAndModuloId(usuarioId, moduloId);
    }

    public ProgressoItem marcarComoConcluido(Long usuarioId, Long moduloId, Long itemId, ItemType itemType) {
        // Find if already exists
        Optional<ProgressoItem> existingProgresso = progressoItemRepository.findByAlunoIdAndModuloIdAndItemIdAndItemType(
                usuarioId, moduloId, itemId, itemType);

        if (existingProgresso.isPresent()) {
            return existingProgresso.get(); // Already marked as complete, return existing
        }

        Usuario aluno = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        Modulo modulo = moduloRepository.findById(moduloId)
                .orElseThrow(() -> new RuntimeException("Módulo não encontrado"));

        ProgressoItem novoProgresso = new ProgressoItem();
        novoProgresso.setAluno(aluno);
        novoProgresso.setModulo(modulo);
        novoProgresso.setItemId(itemId);
        novoProgresso.setItemType(itemType);
        novoProgresso.setDataConclusao(LocalDateTime.now());

        return progressoItemRepository.save(novoProgresso);
    }
}
