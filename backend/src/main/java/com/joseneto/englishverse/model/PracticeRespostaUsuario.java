package com.joseneto.englishverse.model;

import java.time.LocalDateTime;
import java.util.Map;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "practice_respostas_usuario") // Nome exato da imagem
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PracticeRespostaUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK: Qual exercício foi respondido?
    @ManyToOne(optional = false)
    @JoinColumn(name = "atividade_id", nullable = false)
    private PracticeAtividade atividade;

    // FK: Quem respondeu?
    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Usuario aluno;

    // A resposta do aluno (Ex: { "selecionada": "is" } ou { "texto": "blue" })
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "resposta_jsonb", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> resposta;

    // O sistema valida e salva aqui se ele acertou ou errou
    @Column(name = "esta_correta", nullable = false)
    private Boolean estaCorreta;

    @CreationTimestamp
    @Column(name = "data_resposta", updatable = false)
    private LocalDateTime dataResposta;
}
