package com.joseneto.englishverse.model;

import com.joseneto.englishverse.model.enums.TipoRecurso;

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
@Table(name = "recursos_apresentacao")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecursoApresentacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK: Muitos Recursos pertencem a Um Módulo
    @ManyToOne(optional = false)
    @JoinColumn(name = "modulo_id", nullable = false)
    private Modulo modulo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_recurso", nullable = false)
    private TipoRecurso tipoRecurso;

    @Column(name = "url_recurso", nullable = false)
    private String urlRecurso; // Link do YouTube, S3, etc.

    // TEXT permite strings gigantes (maior que 255 caracteres)
    @Column(columnDefinition = "TEXT")
    private String transcricao;

    // Pra controlar se esse vídeo aparece antes ou depois do áudio
    private Integer ordem;
}
