package com.joseneto.englishverse.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.joseneto.englishverse.model.Achievement;
import com.joseneto.englishverse.model.enums.AchievementCategory;
import com.joseneto.englishverse.repository.AchievementRepository;

@Component
@Order(2)
public class GamificationAchievementSeeder implements CommandLineRunner {
    private final AchievementRepository achievementRepository;

    public GamificationAchievementSeeder(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }

    @Override
    public void run(String... args) {
        seed("FIRST_LAUNCH", "First Launch", "Conclua sua primeira atividade.", "rocket_launch", AchievementCategory.CONSISTENCY);
        seed("IN_ORBIT", "In Orbit", "Mantenha uma sequência de 7 dias de aprendizagem.", "orbit_7", AchievementCategory.CONSISTENCY);
        seed("LUNAR_CYCLE", "Lunar Cycle", "Mantenha uma sequência de 30 dias de aprendizagem.", "moon", AchievementCategory.CONSISTENCY);
        seed("SUPERNOVA", "Supernova", "Mantenha uma sequência de 100 dias de aprendizagem.", "supernova", AchievementCategory.CONSISTENCY);
        seed("SHARP_MIND", "Sharp Mind", "Acerte três Practices seguidas na primeira tentativa.", "sharp_mind", AchievementCategory.CONTENT_MASTERY);
        seed("COMPLETE_ORBIT", "Completed Orbit", "Conclua um módulo inteiro do ciclo PPP.", "complete_orbit", AchievementCategory.CONTENT_MASTERY);
        seed("CONSTELLATION_CONQUERED", "Constellation Conquered", "Conclua todos os módulos publicados de um tópico.", "constellation", AchievementCategory.CONTENT_MASTERY);
        seed("VERSE_MASTER", "Verse Master", "Conclua todos os tópicos publicados.", "verse_master", AchievementCategory.CONTENT_MASTERY);
        seed("COSMIC_CINEPHILE", "Cosmic Cinephile", "Conclua um conteúdo baseado em filme.", "cosmic_cinephile", AchievementCategory.POP_CULTURE);
        seed("LYRIC_HUNTER", "Lyric Hunter", "Estude três músicas.", "lyric_hunter", AchievementCategory.POP_CULTURE);
        seed("INTERGALACTIC_READER", "Intergalactic Reader", "Conclua um conteúdo baseado em poema ou quadrinhos.", "intergalactic_reader", AchievementCategory.POP_CULTURE);
        seed("CULTURE_COLLECTOR", "Culture Collector", "Estude pelo menos um item de cada categoria de cultura pop publicada.", "culture_collector", AchievementCategory.POP_CULTURE);
    }

    private void seed(String code, String name, String description, String iconKey, AchievementCategory category) {
        Achievement achievement = achievementRepository.findByCode(code).orElseGet(Achievement::new);
        achievement.setCode(code);
        achievement.setName(name);
        achievement.setDescription(description);
        achievement.setIconKey(iconKey);
        achievement.setCategory(category);
        achievement.setXpReward(0);
        achievementRepository.save(achievement);
    }
}
