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
import com.joseneto.englishverse.model.enums.StatusCorrecao;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
@Table(name = "submissoes_producao") // Nome exato do banco
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionSubmissao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK: Qual desafio foi respondido?
    @ManyToOne(optional = false)
    @JoinColumn(name = "challenge_id", nullable = false)
    private ProductionChallenge challenge;

    // FK: Quem respondeu?
    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Usuario aluno;

    // O JSONB da resposta (ex: { "url_audio": "..." } ou { "texto": "..." })
    // Usando o jeito novo do Hibernate 6 que funcionou pra tu!
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "resposta_jsonb", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> resposta;

    // Campo pro professor escrever depois
    @Column(name = "feedback_professor", columnDefinition = "TEXT")
    private String feedbackProfessor;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_correcao")
    private StatusCorrecao statusCorrecao = StatusCorrecao.PENDENTE;

    @Column(name = "nota")
    private Integer nota;

    @Column(name = "xp_concedido")
    private Boolean xpConcedido = false;

    @Column(name = "data_correcao")
    private LocalDateTime dataCorrecao;

    @CreationTimestamp
    @Column(name = "data_submissao", updatable = false)
    private LocalDateTime dataSubmissao;
}
