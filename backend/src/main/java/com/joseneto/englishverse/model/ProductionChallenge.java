package com.joseneto.englishverse.model;

import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

import com.joseneto.englishverse.model.enums.TipoDesafio;

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
@Table(name = "production_challenges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionChallenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "modulo_id", nullable = false)
    private Modulo modulo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_desafio", nullable = false)
    private TipoDesafio tipoDesafio;

    @Column(name = "instrucao_desafio", columnDefinition = "TEXT", nullable = false)
    private String instrucaoDesafio;

    @Column(name = "midia_desafio_url")
    private String midiaDesafioUrl;

    // A MÁGICA DO JSONB ACONTECE AQUI
    // O Java vê como um Map, o Postgres vê como JSONB
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dados_desafio_jsonb", columnDefinition = "jsonb")
    private Map<String, Object> dadosDesafio;
}
