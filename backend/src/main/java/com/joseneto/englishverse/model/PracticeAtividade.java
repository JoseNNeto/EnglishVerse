package com.joseneto.englishverse.model;

import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.joseneto.englishverse.model.enums.TipoAtividade;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "practice_atividades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PracticeAtividade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK: Essa atividade pertence a qual aula?
    @ManyToOne(optional = false)
    @JoinColumn(name = "modulo_id", nullable = false)
    private Modulo modulo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_atividade", nullable = false)
    private TipoAtividade tipoAtividade;

    @Column(columnDefinition = "TEXT")
    private String instrucao; // Ex: "Marque a opção correta"

    // A MÁGICA DO JSONB (Nativo do Hibernate 6)
    // Ex: { "pergunta": "It ___ easy", "opcoes": ["is", "are"], "correta": "is" }
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dados_atividade_jsonb", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> dadosAtividade;
}
