package com.joseneto.englishverse.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.model.Modulo;
import com.joseneto.englishverse.model.Progresso;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.model.enums.StatusProgresso;
import com.joseneto.englishverse.repository.ModuloRepository;
import com.joseneto.englishverse.repository.ProgressoRepository;
import com.joseneto.englishverse.repository.UsuarioRepository;

@Service
public class ProgressoService {
    @Autowired
    private ProgressoRepository progressoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ModuloRepository moduloRepository;

    // Quando o aluno clica em "Começar Módulo"
    public Progresso iniciarModulo(Long alunoId, Long moduloId) {
        // Verifica se já existe um registro pra não duplicar
        Optional<Progresso> existente = progressoRepository.findByAlunoIdAndModuloId(alunoId, moduloId);
        if (existente.isPresent()) {
            return existente.get(); // Se já começou, só retorna o que tem
        }

        Usuario aluno = usuarioRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));
        Modulo modulo = moduloRepository.findById(moduloId)
                .orElseThrow(() -> new RuntimeException("Módulo não encontrado!"));

        Progresso novo = new Progresso();
        novo.setAluno(aluno);
        novo.setModulo(modulo);
        novo.setStatus(StatusProgresso.EM_ANDAMENTO);
        novo.setDataInicio(LocalDateTime.now());

        return progressoRepository.save(novo);
    }

    // Quando o aluno termina tudo (chamado no final da etapa Production)
    public Progresso concluirModulo(Long alunoId, Long moduloId) {
        Progresso progresso = progressoRepository.findByAlunoIdAndModuloId(alunoId, moduloId)
                .orElseThrow(() -> new RuntimeException("Oxe, o aluno nem começou esse módulo ainda!"));

        progresso.setStatus(StatusProgresso.CONCLUIDO);
        progresso.setDataConclusao(LocalDateTime.now());

        return progressoRepository.save(progresso);
    }

    public List<Progresso> listarEmAndamento(Long alunoId) {
        return progressoRepository.findByAlunoIdAndStatus(alunoId, StatusProgresso.EM_ANDAMENTO);
    }
}
