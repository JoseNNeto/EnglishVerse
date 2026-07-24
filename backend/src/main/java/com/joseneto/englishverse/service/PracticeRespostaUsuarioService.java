package com.joseneto.englishverse.service;

import java.util.List;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joseneto.englishverse.model.PracticeAtividade;
import com.joseneto.englishverse.model.PracticeRespostaUsuario;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.repository.PracticeAtividadeRepository;
import com.joseneto.englishverse.repository.PracticeRespostaUsuarioRepository;
import com.joseneto.englishverse.repository.UsuarioRepository;

@Service
public class PracticeRespostaUsuarioService {
    @Autowired
    private PracticeRespostaUsuarioRepository respostaRepository;
    @Autowired
    private PracticeAtividadeRepository atividadeRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    public PracticeRespostaUsuario registrarResposta(Long usuarioId, PracticeRespostaUsuario respostaUsuario) {
        Usuario aluno = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));

        // 2. Validar Atividade
        if (respostaUsuario.getAtividade() == null || respostaUsuario.getAtividade().getId() == null) {
            throw new RuntimeException("Respondendo qual atividade?");
        }
        PracticeAtividade atividade = atividadeRepository.findById(respostaUsuario.getAtividade().getId())
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada!"));

        respostaUsuario.setAluno(aluno);
        respostaUsuario.setAtividade(atividade);
        respostaUsuario.setEstaCorreta(validarResposta(atividade, respostaUsuario.getResposta()));
        return respostaRepository.save(respostaUsuario);
    }

    private boolean validarResposta(PracticeAtividade atividade, Map<String, Object> resposta) {
        if (resposta == null || resposta.isEmpty()) {
            return false;
        }
        Map<String, Object> dados = atividade.getDadosAtividade();
        return switch (atividade.getTipoAtividade()) {
            case MULTIPLA_ESCOLHA -> iguais(resposta.get("selecionada"), dados.get("resposta_correta"));
            case PREENCHER_LACUNA -> iguaisNormalizados(resposta.get("resposta"), dados.get("resposta_correta"));
            case LISTA_PALAVRAS -> validarLista(resposta.get("respostas"), dados);
            case SELECIONAR_PALAVRAS -> validarSelecao(resposta.get("palavrasSelecionadas"), dados);
            case RELACIONAR_COLUNAS -> mapaDeStrings(resposta.get("relacoes"))
                .equals(mapaDeStrings(dados.get("resposta_correta")));
            case SUBSTITUIR_PALAVRAS -> mapaDeStrings(resposta.get("substituicoes"))
                .equals(mapaDeStrings(dados.get("respostas_corretas")));
        };
    }

    private boolean validarLista(Object respostasObject, Map<String, Object> dados) {
        List<String> respostas = listaDeStrings(respostasObject).stream()
            .map(this::normalizar).filter(value -> !value.isBlank()).toList();
        Set<String> respostasUnicas = new HashSet<>(respostas);
        Set<String> possiveis = new HashSet<>(listaDeStrings(dados.get("respostas_possiveis")).stream()
            .map(this::normalizar).toList());
        int quantidade = Integer.parseInt(Objects.toString(dados.getOrDefault("numberOfInputs", 0)));
        return respostas.size() == quantidade && respostasUnicas.size() == quantidade
            && possiveis.containsAll(respostasUnicas);
    }

    private boolean validarSelecao(Object respostasObject, Map<String, Object> dados) {
        List<String> selecionadas = listaDeStrings(respostasObject).stream().map(this::normalizar).toList();
        Set<String> tiposCorretos = new HashSet<>(listaDeStrings(dados.get("palavras_corretas")).stream()
            .map(this::normalizar).toList());
        String texto = Objects.toString(dados.getOrDefault("texto_base", ""));
        List<String> esperadas = List.of(texto.split("[^\\p{L}']+")).stream()
            .map(this::normalizar).filter(tiposCorretos::contains).toList();
        return frequencias(selecionadas).equals(frequencias(esperadas));
    }

    private Map<String, Long> frequencias(List<String> values) {
        Map<String, Long> result = new HashMap<>();
        values.forEach(value -> result.merge(value, 1L, Long::sum));
        return result;
    }

    private Map<String, String> mapaDeStrings(Object value) {
        if (!(value instanceof Map<?, ?> source)) {
            return Map.of();
        }
        Map<String, String> result = new HashMap<>();
        source.forEach((key, item) -> result.put(Objects.toString(key), Objects.toString(item)));
        return result;
    }

    private List<String> listaDeStrings(Object value) {
        if (!(value instanceof List<?> source)) {
            return List.of();
        }
        return source.stream().map(Objects::toString).toList();
    }

    private boolean iguais(Object left, Object right) {
        return Objects.toString(left, "").equals(Objects.toString(right, ""));
    }

    private boolean iguaisNormalizados(Object left, Object right) {
        return normalizar(Objects.toString(left, "")).equals(normalizar(Objects.toString(right, "")));
    }

    private String normalizar(String value) {
        return value.trim().toLowerCase();
    }

    public List<PracticeRespostaUsuario> listarPorAluno(Long alunoId) {
        return respostaRepository.findByAlunoId(alunoId);
    }
}
