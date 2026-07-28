package com.joseneto.englishverse.model;

import java.util.LinkedHashSet;
import java.util.Set;

import com.joseneto.englishverse.model.enums.IdiomaTurma;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "turmas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Turma {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String periodo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IdiomaTurma idioma = IdiomaTurma.PORTUGUES;

    @ManyToOne(optional = false)
    @JoinColumn(name = "docente_id", nullable = false)
    private Usuario docente;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "turma_alunos",
        joinColumns = @JoinColumn(name = "turma_id"),
        inverseJoinColumns = @JoinColumn(name = "aluno_id")
    )
    private Set<Usuario> alunos = new LinkedHashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "turma_modulos",
        joinColumns = @JoinColumn(name = "turma_id"),
        inverseJoinColumns = @JoinColumn(name = "modulo_id")
    )
    private Set<Modulo> modulos = new LinkedHashSet<>();
}
