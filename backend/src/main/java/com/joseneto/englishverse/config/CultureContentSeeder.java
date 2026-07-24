package com.joseneto.englishverse.config;

import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;

import com.joseneto.englishverse.model.Modulo;
import com.joseneto.englishverse.model.PracticeAtividade;
import com.joseneto.englishverse.model.ProductionChallenge;
import com.joseneto.englishverse.model.RecursoApresentacao;
import com.joseneto.englishverse.model.enums.MediaCategory;
import com.joseneto.englishverse.repository.ModuloRepository;
import com.joseneto.englishverse.repository.PracticeAtividadeRepository;
import com.joseneto.englishverse.repository.ProductionChallengeRepository;
import com.joseneto.englishverse.repository.RecursoApresentacaoRepository;

@Component
@Order(3)
public class CultureContentSeeder implements CommandLineRunner {
    private final ModuloRepository moduloRepository;
    private final RecursoApresentacaoRepository presentationRepository;
    private final PracticeAtividadeRepository practiceRepository;
    private final ProductionChallengeRepository productionRepository;

    public CultureContentSeeder(
            ModuloRepository moduloRepository,
            RecursoApresentacaoRepository presentationRepository,
            PracticeAtividadeRepository practiceRepository,
            ProductionChallengeRepository productionRepository) {
        this.moduloRepository = moduloRepository;
        this.presentationRepository = presentationRepository;
        this.practiceRepository = practiceRepository;
        this.productionRepository = productionRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        classify("Subject Pronouns (I, You, He, She, It, We, They)",
            Map.of(0, MediaCategory.MUSIC, 1, MediaCategory.MUSIC, 2, MediaCategory.MUSIC),
            Map.of(0, MediaCategory.MUSIC, 1, MediaCategory.MUSIC, 2, MediaCategory.FILM, 3, MediaCategory.MUSIC),
            Map.of(1, MediaCategory.FILM));

        classify("Articles (A, An, The)",
            Map.of(0, MediaCategory.FILM),
            Map.of(0, MediaCategory.MUSIC, 1, MediaCategory.COMICS, 2, MediaCategory.FILM),
            Map.of(0, MediaCategory.COMICS));

        classify("Present Simple (‘To Be’) - Am, Is, Are",
            Map.of(0, MediaCategory.MUSIC, 1, MediaCategory.MUSIC),
            Map.of(0, MediaCategory.COMICS, 1, MediaCategory.FILM, 2, MediaCategory.MUSIC),
            Map.of(0, MediaCategory.POETRY));

        classify("Present Simple (‘to have’ & other verbs)",
            Map.of(0, MediaCategory.MUSIC),
            Map.of(0, MediaCategory.MUSIC, 1, MediaCategory.MUSIC),
            Map.of(0, MediaCategory.MUSIC));

        classify("Adverbs of frequency",
            Map.of(0, MediaCategory.MUSIC),
            Map.of(0, MediaCategory.MUSIC, 1, MediaCategory.MUSIC, 2, MediaCategory.FILM),
            Map.of());
    }

    private void classify(
            String moduleTitle,
            Map<Integer, MediaCategory> presentationCategories,
            Map<Integer, MediaCategory> practiceCategories,
            Map<Integer, MediaCategory> productionCategories) {
        moduloRepository.findByTitulo(moduleTitle).ifPresent(module -> {
            tag(
                presentationRepository.findByModuloIdOrderByOrdemAsc(module.getId()),
                presentationCategories,
                RecursoApresentacao::setMediaCategory
            );
            tag(
                practiceRepository.findByModuloIdOrderByIdAsc(module.getId()),
                practiceCategories,
                PracticeAtividade::setMediaCategory
            );
            tag(
                productionRepository.findByModuloIdOrderByIdAsc(module.getId()),
                productionCategories,
                ProductionChallenge::setMediaCategory
            );
        });
    }

    private <T> void tag(
            List<T> items,
            Map<Integer, MediaCategory> categories,
            BiConsumer<T, MediaCategory> setter) {
        categories.forEach((index, category) -> {
            if (index < items.size()) {
                setter.accept(items.get(index), category);
            }
        });
    }
}
