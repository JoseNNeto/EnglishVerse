package com.joseneto.englishverse.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.joseneto.englishverse.model.enums.ItemType;

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
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "progresso_itens", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"aluno_id", "item_id", "item_type"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressoItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Usuario aluno;

    @ManyToOne(optional = false)
    @JoinColumn(name = "modulo_id", nullable = false)
    private Modulo modulo;

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private ItemType itemType;

    @CreationTimestamp
    @Column(name = "data_conclusao", updatable = false)
    private LocalDateTime dataConclusao;
}
