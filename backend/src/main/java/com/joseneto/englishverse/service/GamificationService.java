package com.joseneto.englishverse.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.joseneto.englishverse.dtos.GamificationAchievementDTO;
import com.joseneto.englishverse.dtos.GamificationJourneyDTO;
import com.joseneto.englishverse.dtos.GamificationSummaryDTO;
import com.joseneto.englishverse.dtos.ModuleJourneyDTO;
import com.joseneto.englishverse.dtos.NextMissionDTO;
import com.joseneto.englishverse.dtos.StarCapsuleDTO;
import com.joseneto.englishverse.dtos.StarCapsuleOpenDTO;
import com.joseneto.englishverse.dtos.UserRewardItemDTO;
import com.joseneto.englishverse.dtos.XpTimelineEventDTO;
import com.joseneto.englishverse.model.Achievement;
import com.joseneto.englishverse.model.Modulo;
import com.joseneto.englishverse.model.Progresso;
import com.joseneto.englishverse.model.ProgressoItem;
import com.joseneto.englishverse.model.PracticeRespostaUsuario;
import com.joseneto.englishverse.model.StarCapsule;
import com.joseneto.englishverse.model.UserAchievement;
import com.joseneto.englishverse.model.UserGamificationProfile;
import com.joseneto.englishverse.model.UserRewardItem;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.model.XpEvent;
import com.joseneto.englishverse.model.enums.GamificationLevel;
import com.joseneto.englishverse.model.enums.AchievementCategory;
import com.joseneto.englishverse.model.enums.ItemType;
import com.joseneto.englishverse.model.enums.MediaCategory;
import com.joseneto.englishverse.model.enums.RewardType;
import com.joseneto.englishverse.model.enums.StarCapsuleStatus;
import com.joseneto.englishverse.model.enums.StatusProgresso;
import com.joseneto.englishverse.model.enums.XpEventType;
import com.joseneto.englishverse.model.enums.XpSourceType;
import com.joseneto.englishverse.repository.AchievementRepository;
import com.joseneto.englishverse.repository.ModuloRepository;
import com.joseneto.englishverse.repository.PracticeAtividadeRepository;
import com.joseneto.englishverse.repository.PracticeRespostaUsuarioRepository;
import com.joseneto.englishverse.repository.ProgressoItemRepository;
import com.joseneto.englishverse.repository.ProgressoRepository;
import com.joseneto.englishverse.repository.ProductionChallengeRepository;
import com.joseneto.englishverse.repository.RecursoApresentacaoRepository;
import com.joseneto.englishverse.repository.StarCapsuleRepository;
import com.joseneto.englishverse.repository.UserAchievementRepository;
import com.joseneto.englishverse.repository.UserGamificationProfileRepository;
import com.joseneto.englishverse.repository.UserRewardItemRepository;
import com.joseneto.englishverse.repository.UsuarioRepository;
import com.joseneto.englishverse.repository.XpEventRepository;

@Service
public class GamificationService {
    public static final int PRESENTATION_XP = 10;
    public static final int PRACTICE_XP = 20;
    public static final int PRODUCTION_XP = 30;
    public static final int PRACTICE_STAGE_XP = 20;
    public static final int MODULE_XP = 50;
    public static final int TOPIC_XP = 100;
    public static final int DAILY_XP = 5;
    public static final int STAR_CAPSULE_XP = 10;

    private final UserGamificationProfileRepository profileRepository;
    private final StarCapsuleRepository starCapsuleRepository;
    private final UserRewardItemRepository userRewardItemRepository;
    private final UsuarioRepository usuarioRepository;
    private final XpEventRepository xpEventRepository;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final ModuloRepository moduloRepository;
    private final ProgressoRepository progressoRepository;
    private final ProgressoItemRepository progressoItemRepository;
    private final RecursoApresentacaoRepository recursoRepository;
    private final PracticeAtividadeRepository practiceRepository;
    private final PracticeRespostaUsuarioRepository practiceRespostaRepository;
    private final ProductionChallengeRepository productionRepository;
    private final ZoneId gamificationZone;

    public GamificationService(
            UserGamificationProfileRepository profileRepository,
            XpEventRepository xpEventRepository,
            AchievementRepository achievementRepository,
            UserAchievementRepository userAchievementRepository,
            ModuloRepository moduloRepository,
            ProgressoRepository progressoRepository,
            ProgressoItemRepository progressoItemRepository,
            RecursoApresentacaoRepository recursoRepository,
            PracticeAtividadeRepository practiceRepository,
            PracticeRespostaUsuarioRepository practiceRespostaRepository,
            ProductionChallengeRepository productionRepository,
            StarCapsuleRepository starCapsuleRepository,
            UserRewardItemRepository userRewardItemRepository,
            UsuarioRepository usuarioRepository,
            @Value("${app.gamification.zone-id:America/Fortaleza}") String zoneId) {
        this.profileRepository = profileRepository;
        this.xpEventRepository = xpEventRepository;
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.moduloRepository = moduloRepository;
        this.progressoRepository = progressoRepository;
        this.progressoItemRepository = progressoItemRepository;
        this.recursoRepository = recursoRepository;
        this.practiceRepository = practiceRepository;
        this.practiceRespostaRepository = practiceRespostaRepository;
        this.productionRepository = productionRepository;
        this.starCapsuleRepository = starCapsuleRepository;
        this.userRewardItemRepository = userRewardItemRepository;
        this.usuarioRepository = usuarioRepository;
        this.gamificationZone = ZoneId.of(zoneId);
    }

    @Transactional
    public GamificationAwardResult processNewItemCompletion(
            Usuario user, Modulo module, Long itemId, ItemType itemType) {
        UserGamificationProfile profile = getOrCreateProfile(user, true);
        List<XpEvent> events = new ArrayList<>();
        List<Achievement> achievements = new ArrayList<>();

        XpEventType eventType;
        XpSourceType sourceType;
        int amount;
        String description;

        switch (itemType) {
            case PRESENTATION -> {
                eventType = XpEventType.PRESENTATION_COMPLETED;
                sourceType = XpSourceType.PRESENTATION;
                amount = PRESENTATION_XP;
                description = "Presentation completed";
            }
            case PRACTICE -> {
                eventType = XpEventType.PRACTICE_COMPLETED;
                sourceType = XpSourceType.PRACTICE;
                amount = PRACTICE_XP;
                description = "Practice completed";
            }
            case PRODUCTION -> {
                eventType = XpEventType.PRODUCTION_SUBMITTED;
                sourceType = XpSourceType.PRODUCTION;
                amount = PRODUCTION_XP;
                description = "Production submitted";
            }
            default -> throw new IllegalArgumentException("Tipo de item não suportado");
        }

        awardXp(profile, user, eventType, sourceType, itemId, amount, description,
                "ITEM:%d:%d:%s:%d".formatted(user.getId(), module.getId(), itemType, itemId))
            .ifPresent(events::add);

        updateStreakAndDailyBonus(profile, user).ifPresent(events::add);
        unlock(profile, user, "FIRST_LAUNCH").ifPresent(achievements::add);

        if (itemType == ItemType.PRACTICE && isPracticeStageComplete(user.getId(), module.getId())) {
            awardXp(profile, user, XpEventType.PRACTICE_STAGE_COMPLETED, XpSourceType.PRACTICE,
                    module.getId(), PRACTICE_STAGE_XP, "Practice stage completed",
                    "PRACTICE_STAGE:%d:%d".formatted(user.getId(), module.getId()))
                .ifPresent(events::add);
        }

        unlockStreakAchievements(profile, user, achievements);
        if (itemType == ItemType.PRACTICE) {
            unlockSharpMind(profile, user, achievements);
        }
        unlockPopCultureAchievements(profile, user, achievements);
        ensureCategoryCapsules(user);
        profileRepository.save(profile);
        return new GamificationAwardResult(List.copyOf(events), List.copyOf(achievements));
    }

    @Transactional
    public GamificationAwardResult processRepeatedItemCompletion(
            Usuario user, Modulo module, Long itemId, ItemType itemType) {
        UserGamificationProfile profile = getOrCreateProfile(user, true);
        List<XpEvent> events = new ArrayList<>();
        List<Achievement> achievements = new ArrayList<>();

        XpSourceType sourceType;
        int replayXp;
        String activityName;
        switch (itemType) {
            case PRESENTATION -> {
                sourceType = XpSourceType.PRESENTATION;
                replayXp = PRESENTATION_XP / 2;
                activityName = "Presentation";
            }
            case PRACTICE -> {
                sourceType = XpSourceType.PRACTICE;
                replayXp = PRACTICE_XP / 2;
                activityName = "Practice";
            }
            case PRODUCTION -> {
                sourceType = XpSourceType.PRODUCTION;
                replayXp = PRODUCTION_XP / 2;
                activityName = "Production";
            }
            default -> throw new IllegalArgumentException("Tipo de item nÃ£o suportado");
        }

        Optional<XpEvent> replayEvent = awardXp(
            profile,
            user,
            XpEventType.ACTIVITY_REPEATED,
            sourceType,
            itemId,
            replayXp,
            activityName + " repeated for the first time (50% XP)",
            "ITEM_REPLAY:%d:%d:%s:%d".formatted(user.getId(), module.getId(), itemType, itemId)
        );
        replayEvent.ifPresent(events::add);

        // Only the first replay is a rewarded learning action. Later replays
        // grant neither base XP nor a daily bonus.
        if (replayEvent.isPresent()) {
            updateStreakAndDailyBonus(profile, user).ifPresent(events::add);
            unlockStreakAchievements(profile, user, achievements);
            ensureCategoryCapsules(user);
        }

        profileRepository.save(profile);
        return new GamificationAwardResult(List.copyOf(events), List.copyOf(achievements));
    }

    @Transactional
    public GamificationAwardResult processModuleCompletion(Usuario user, Modulo module) {
        UserGamificationProfile profile = getOrCreateProfile(user, true);
        List<XpEvent> events = new ArrayList<>();
        List<Achievement> achievements = new ArrayList<>();

        awardXp(profile, user, XpEventType.MODULE_COMPLETED, XpSourceType.MODULE,
                module.getId(), MODULE_XP, "Completed Orbit: " + module.getTitulo(),
                "MODULE:%d:%d".formatted(user.getId(), module.getId()))
            .ifPresent(events::add);
        unlock(profile, user, "COMPLETE_ORBIT").ifPresent(achievements::add);

        Long topicId = module.getTopico().getId();
        if (isTopicComplete(user.getId(), topicId)) {
            awardXp(profile, user, XpEventType.TOPIC_COMPLETED, XpSourceType.TOPIC,
                    topicId, TOPIC_XP, "Constellation Conquered: " + module.getTopico().getNome(),
                    "TOPIC:%d:%d".formatted(user.getId(), topicId))
                .ifPresent(events::add);
            unlock(profile, user, "CONSTELLATION_CONQUERED").ifPresent(achievements::add);
        }

        if (areAllPublishedTopicsComplete(user.getId())) {
            unlock(profile, user, "VERSE_MASTER").ifPresent(achievements::add);
        }

        ensureCategoryCapsules(user);
        profileRepository.save(profile);
        return new GamificationAwardResult(List.copyOf(events), List.copyOf(achievements));
    }

    @Transactional
    public GamificationJourneyDTO getJourney(Usuario user) {
        UserGamificationProfile profile = getOrCreateProfile(user, true);
        List<Achievement> synchronizedAchievements = new ArrayList<>();
        unlockPopCultureAchievements(profile, user, synchronizedAchievements);
        unlockSharpMind(profile, user, synchronizedAchievements);
        if (areAllPublishedTopicsComplete(user.getId())) {
            unlock(profile, user, "VERSE_MASTER").ifPresent(synchronizedAchievements::add);
        }
        ensureCategoryCapsules(user);
        backfillOpenedCapsuleRewards(user);
        List<ModuleJourneyDTO> modules = buildModuleJourney(user.getId());
        long completedModules = modules.stream().filter(m -> "CONCLUIDO".equals(m.status())).count();
        List<GamificationAchievementDTO> achievements = getAchievementsInternal(user.getId());
        List<XpTimelineEventDTO> timeline = getTimelineInternal(user.getId());
        GamificationSummaryDTO summary = buildSummary(profile, completedModules, modules.size(),
                achievements.stream().filter(GamificationAchievementDTO::unlocked).count());
        NextMissionDTO nextMission = buildNextMission(modules);
        List<StarCapsuleDTO> starCapsules = getStarCapsulesInternal(user.getId());
        List<UserRewardItemDTO> inventory = getInventoryInternal(user.getId());
        return new GamificationJourneyDTO(
            summary, nextMission, modules, achievements, timeline, starCapsules, inventory);
    }

    @Transactional
    public GamificationSummaryDTO getSummary(Usuario user) {
        return getJourney(user).summary();
    }

    @Transactional(readOnly = true)
    public List<XpTimelineEventDTO> getTimeline(Long userId) {
        return getTimelineInternal(userId);
    }

    @Transactional(readOnly = true)
    public List<GamificationAchievementDTO> getAchievements(Long userId) {
        return getAchievementsInternal(userId);
    }

    @Transactional
    public StarCapsuleOpenDTO openStarCapsule(
            Usuario user, Long capsuleId, RewardType selectedRewardType) {
        UserGamificationProfile profile = getOrCreateProfile(user, true);
        StarCapsule capsule = starCapsuleRepository.findWithLockByIdAndUserId(capsuleId, user.getId())
            .orElseThrow(() -> new IllegalArgumentException("Star Capsule not found"));
        Optional<UserRewardItem> existingReward = userRewardItemRepository.findBySourceCapsuleId(capsuleId);

        if (capsule.getStatus() == StarCapsuleStatus.OPENED) {
            UserRewardItem specialReward = null;
            if (capsule.getCategory() != AchievementCategory.POP_CULTURE) {
                specialReward = existingReward.orElseGet(() ->
                    grantSpecialReward(user, capsule, rewardFor(capsule.getCategory(), selectedRewardType, true)));
            }
            return new StarCapsuleOpenDTO(
                new StarCapsuleDTO(capsule),
                GamificationAwardResult.empty().toDto(),
                specialReward == null ? null : new UserRewardItemDTO(specialReward)
            );
        }

        RewardDefinition definition = rewardFor(capsule.getCategory(), selectedRewardType, false);
        capsule.setStatus(StarCapsuleStatus.OPENED);
        capsule.setOpenedAt(LocalDateTime.now(gamificationZone));
        UserRewardItem specialReward = null;
        if (definition != null) {
            capsule.setSpecialRewardType(definition.type());
            capsule.setSpecialRewardCode(definition.code());
            specialReward = grantSpecialReward(user, capsule, definition);
        } else {
            capsule.setSpecialRewardType(null);
            capsule.setSpecialRewardCode(null);
        }
        Optional<XpEvent> event = awardXp(
            profile,
            user,
            XpEventType.STAR_CAPSULE_OPENED,
            XpSourceType.STAR_CAPSULE,
            capsule.getId(),
            capsule.getRewardXp(),
            "Star Capsule opened",
            "STAR_CAPSULE:%d:%d".formatted(user.getId(), capsule.getId())
        );
        starCapsuleRepository.save(capsule);
        profileRepository.save(profile);
        GamificationAwardResult reward = new GamificationAwardResult(
            event.map(List::of).orElseGet(List::of),
            List.of()
        );
        return new StarCapsuleOpenDTO(
            new StarCapsuleDTO(capsule), reward.toDto(),
            specialReward == null ? null : new UserRewardItemDTO(specialReward));
    }

    @Transactional
    public UserRewardItemDTO equipInventoryItem(Usuario user, Long itemId) {
        UserRewardItem item = userRewardItemRepository.findWithLockByIdAndUserId(itemId, user.getId())
            .orElseThrow(() -> new IllegalArgumentException("Reward item not found"));
        if (item.getRewardType() != RewardType.PROFILE_TITLE
                && item.getRewardType() != RewardType.AVATAR_FRAME) {
            throw new IllegalArgumentException("This reward cannot be equipped");
        }
        List<UserRewardItem> sameType = userRewardItemRepository.findByUserIdAndRewardType(
            user.getId(), item.getRewardType());
        sameType.forEach(candidate -> candidate.setEquipped(candidate.getId().equals(item.getId())));
        userRewardItemRepository.saveAll(sameType);
        return new UserRewardItemDTO(item);
    }

    private Optional<XpEvent> updateStreakAndDailyBonus(UserGamificationProfile profile, Usuario user) {
        LocalDate today = LocalDate.now(gamificationZone);
        LocalDate lastActivity = profile.getLastValidActivityDate();
        if (today.equals(lastActivity)) {
            return Optional.empty();
        }

        boolean consecutiveDay = lastActivity != null && lastActivity.plusDays(1).equals(today);
        boolean protectedByShield = lastActivity != null
            && profile.getCurrentStreak() > 0
            && lastActivity.plusDays(2).equals(today)
            && consumeOrbitalShield(user.getId());
        int nextStreak = consecutiveDay || protectedByShield ? profile.getCurrentStreak() + 1 : 1;
        profile.setCurrentStreak(nextStreak);
        profile.setLongestStreak(Math.max(profile.getLongestStreak(), nextStreak));
        profile.setLastValidActivityDate(today);

        return awardXp(profile, user, XpEventType.DAILY_ACTIVITY_BONUS, XpSourceType.DAILY_BONUS,
                null, DAILY_XP, "Day orbiting streak maintained",
                "DAILY:%d:%s".formatted(user.getId(), today));
    }

    private Optional<XpEvent> awardXp(
            UserGamificationProfile profile,
            Usuario user,
            XpEventType type,
            XpSourceType sourceType,
            Long sourceId,
            int amount,
            String description,
            String uniqueKey) {
        if (xpEventRepository.existsByUniqueKey(uniqueKey)) {
            return Optional.empty();
        }

        XpEvent event = new XpEvent();
        event.setUser(user);
        event.setType(type);
        event.setSourceType(sourceType);
        event.setSourceId(sourceId);
        event.setXpAmount(amount);
        event.setDescription(description);
        event.setEventDateTime(LocalDateTime.now(gamificationZone));
        event.setUniqueKey(uniqueKey);
        XpEvent saved = xpEventRepository.save(event);

        int totalXp = profile.getTotalXp() + amount;
        profile.setTotalXp(totalXp);
        profile.setCurrentLevel(GamificationLevel.fromXp(totalXp));
        return Optional.of(saved);
    }

    private Optional<Achievement> unlock(UserGamificationProfile profile, Usuario user, String code) {
        Optional<Achievement> achievementOptional = achievementRepository.findByCode(code);
        if (achievementOptional.isEmpty()) {
            return Optional.empty();
        }
        Achievement achievement = achievementOptional.get();
        if (userAchievementRepository.existsByUserIdAndAchievementId(user.getId(), achievement.getId())) {
            return Optional.empty();
        }
        UserAchievement userAchievement = new UserAchievement();
        userAchievement.setUser(user);
        userAchievement.setAchievement(achievement);
        userAchievement.setUnlockedAt(LocalDateTime.now(gamificationZone));
        userAchievementRepository.save(userAchievement);
        if (achievement.getXpReward() > 0) {
            profile.setTotalXp(profile.getTotalXp() + achievement.getXpReward());
            profile.setCurrentLevel(GamificationLevel.fromXp(profile.getTotalXp()));
        }
        return Optional.of(achievement);
    }

    private void unlockStreakAchievements(
            UserGamificationProfile profile, Usuario user, List<Achievement> unlocked) {
        if (profile.getCurrentStreak() >= 7) {
            unlock(profile, user, "IN_ORBIT").ifPresent(unlocked::add);
        }
        if (profile.getCurrentStreak() >= 30) {
            unlock(profile, user, "LUNAR_CYCLE").ifPresent(unlocked::add);
        }
        if (profile.getCurrentStreak() >= 100) {
            unlock(profile, user, "SUPERNOVA").ifPresent(unlocked::add);
        }
    }

    private void unlockPopCultureAchievements(
            UserGamificationProfile profile, Usuario user, List<Achievement> unlocked) {
        Map<MediaCategory, Integer> completedByCategory = new EnumMap<>(MediaCategory.class);
        for (ProgressoItem item : progressoItemRepository.findByAlunoId(user.getId())) {
            resolveMediaCategory(item).ifPresent(category ->
                completedByCategory.merge(category, 1, Integer::sum));
        }

        if (completedByCategory.getOrDefault(MediaCategory.FILM, 0) >= 1) {
            unlock(profile, user, "COSMIC_CINEPHILE").ifPresent(unlocked::add);
        }
        if (completedByCategory.getOrDefault(MediaCategory.MUSIC, 0) >= 3) {
            unlock(profile, user, "LYRIC_HUNTER").ifPresent(unlocked::add);
        }
        if (completedByCategory.getOrDefault(MediaCategory.POETRY, 0) >= 1
                || completedByCategory.getOrDefault(MediaCategory.COMICS, 0) >= 1) {
            unlock(profile, user, "INTERGALACTIC_READER").ifPresent(unlocked::add);
        }
        EnumSet<MediaCategory> publishedCategories = EnumSet.noneOf(MediaCategory.class);
        recursoRepository.findAll().stream()
            .map(resource -> resource.getMediaCategory())
            .filter(java.util.Objects::nonNull)
            .forEach(publishedCategories::add);
        practiceRepository.findAll().stream()
            .map(practice -> practice.getMediaCategory())
            .filter(java.util.Objects::nonNull)
            .forEach(publishedCategories::add);
        productionRepository.findAll().stream()
            .map(production -> production.getMediaCategory())
            .filter(java.util.Objects::nonNull)
            .forEach(publishedCategories::add);
        boolean sampledEveryCategory = !publishedCategories.isEmpty() && publishedCategories.stream()
            .allMatch(category -> completedByCategory.getOrDefault(category, 0) >= 1);
        if (sampledEveryCategory) {
            unlock(profile, user, "CULTURE_COLLECTOR").ifPresent(unlocked::add);
        }
    }

    private void unlockSharpMind(
            UserGamificationProfile profile, Usuario user, List<Achievement> unlocked) {
        Map<Long, Boolean> firstAttemptByPractice = new LinkedHashMap<>();
        for (PracticeRespostaUsuario response
                : practiceRespostaRepository.findByAlunoIdOrderByDataRespostaAscIdAsc(user.getId())) {
            firstAttemptByPractice.putIfAbsent(
                response.getAtividade().getId(), Boolean.TRUE.equals(response.getEstaCorreta()));
        }

        int consecutiveCorrect = 0;
        for (boolean correct : firstAttemptByPractice.values()) {
            consecutiveCorrect = correct ? consecutiveCorrect + 1 : 0;
            if (consecutiveCorrect >= 3) {
                unlock(profile, user, "SHARP_MIND").ifPresent(unlocked::add);
                return;
            }
        }
    }

    private Optional<MediaCategory> resolveMediaCategory(ProgressoItem item) {
        return switch (item.getItemType()) {
            case PRESENTATION -> recursoRepository.findById(item.getItemId())
                .map(resource -> resource.getMediaCategory());
            case PRACTICE -> practiceRepository.findById(item.getItemId())
                .map(practice -> practice.getMediaCategory());
            case PRODUCTION -> productionRepository.findById(item.getItemId())
                .map(production -> production.getMediaCategory());
        };
    }

    private void ensureCategoryCapsules(Usuario user) {
        Map<AchievementCategory, Integer> totalByCategory = new EnumMap<>(AchievementCategory.class);
        achievementRepository.findAllByOrderByCategoryAscNameAsc().forEach(achievement ->
            totalByCategory.merge(achievement.getCategory(), 1, Integer::sum));

        Map<AchievementCategory, Integer> unlockedByCategory = new EnumMap<>(AchievementCategory.class);
        userAchievementRepository.findByUserIdOrderByUnlockedAtDesc(user.getId()).forEach(userAchievement ->
            unlockedByCategory.merge(userAchievement.getAchievement().getCategory(), 1, Integer::sum));

        for (AchievementCategory category : AchievementCategory.values()) {
            int total = totalByCategory.getOrDefault(category, 0);
            if (total > 0 && unlockedByCategory.getOrDefault(category, 0) >= total) {
                createCategoryCapsule(user, category);
            }
        }
    }

    private void createCategoryCapsule(Usuario user, AchievementCategory category) {
        if (starCapsuleRepository.existsByUserIdAndCategory(user.getId(), category)) {
            return;
        }
        StarCapsule capsule = new StarCapsule();
        capsule.setUser(user);
        capsule.setCategory(category);
        capsule.setStatus(StarCapsuleStatus.AVAILABLE);
        capsule.setRewardXp(STAR_CAPSULE_XP);
        capsule.setEarnedAt(LocalDateTime.now(gamificationZone));
        starCapsuleRepository.save(capsule);
    }

    private RewardDefinition rewardFor(
            AchievementCategory category, RewardType selectedRewardType, boolean allowDefault) {
        return switch (category) {
            case CONSISTENCY -> new RewardDefinition(
                RewardType.ORBITAL_SHIELD,
                "orbital_shield",
                "Orbital Shield",
                "Protege seus Days orbiting quando você deixa de estudar por exatamente um dia.",
                null
            );
            case POP_CULTURE -> null;
            case CONTENT_MASTERY -> {
                RewardType choice = selectedRewardType;
                if (choice == null && allowDefault) {
                    choice = RewardType.PROFILE_TITLE;
                }
                if (choice == RewardType.PROFILE_TITLE) {
                    yield new RewardDefinition(
                        RewardType.PROFILE_TITLE,
                        "verse_master_title",
                        "Verse Master",
                        "Um título exclusivo para o perfil por dominar a jornada publicada do EnglishVerse.",
                        null
                    );
                }
                if (choice == RewardType.AVATAR_FRAME) {
                    yield new RewardDefinition(
                        RewardType.AVATAR_FRAME,
                        "cosmic_pathfinder_frame",
                        "Cosmic Pathfinder Frame",
                        "Uma moldura cósmica luminosa para o avatar do seu perfil.",
                        null
                    );
                }
                throw new IllegalArgumentException(
                    "Choose PROFILE_TITLE or AVATAR_FRAME for the Content Mastery Star Capsule");
            }
        };
    }

    private UserRewardItem grantSpecialReward(
            Usuario user, StarCapsule capsule, RewardDefinition definition) {
        Optional<UserRewardItem> existing = userRewardItemRepository.findBySourceCapsuleId(capsule.getId());
        if (existing.isPresent()) {
            return existing.get();
        }
        capsule.setSpecialRewardType(definition.type());
        capsule.setSpecialRewardCode(definition.code());
        UserRewardItem item = new UserRewardItem();
        item.setUser(user);
        item.setSourceCapsule(capsule);
        item.setRewardType(definition.type());
        item.setRewardCode(definition.code());
        item.setName(definition.name());
        item.setDescription(definition.description());
        item.setAssetUrl(definition.assetUrl());
        item.setQuantity(1);
        item.setEquipped(false);
        item.setUnlockedAt(LocalDateTime.now(gamificationZone));
        return userRewardItemRepository.save(item);
    }

    private void backfillOpenedCapsuleRewards(Usuario user) {
        starCapsuleRepository.findByUserIdOrderByEarnedAtDesc(user.getId()).stream()
            .filter(capsule -> capsule.getStatus() == StarCapsuleStatus.OPENED)
            .filter(capsule -> capsule.getCategory() != AchievementCategory.POP_CULTURE)
            .filter(capsule -> userRewardItemRepository.findBySourceCapsuleId(capsule.getId()).isEmpty())
            .forEach(capsule -> grantSpecialReward(
                user, capsule, rewardFor(capsule.getCategory(), capsule.getSpecialRewardType(), true)));
    }

    private boolean consumeOrbitalShield(Long userId) {
        Optional<UserRewardItem> shield = userRewardItemRepository
            .findFirstByUserIdAndRewardTypeAndQuantityGreaterThanOrderByUnlockedAtAsc(
                userId, RewardType.ORBITAL_SHIELD, 0);
        if (shield.isEmpty()) {
            return false;
        }
        UserRewardItem item = shield.get();
        item.setQuantity(item.getQuantity() - 1);
        userRewardItemRepository.save(item);
        return true;
    }

    private boolean isPracticeStageComplete(Long userId, Long moduleId) {
        long total = practiceRepository.countByModuloId(moduleId);
        long completed = progressoItemRepository.countByAlunoIdAndModuloIdAndItemType(
            userId, moduleId, ItemType.PRACTICE);
        return total > 0 && completed >= total;
    }

    private boolean isTopicComplete(Long userId, Long topicId) {
        List<Modulo> publishedModules = moduloRepository.findByTopicoIdAndPublicadoTrue(topicId);
        return !publishedModules.isEmpty() && publishedModules.stream().allMatch(module ->
            progressoRepository.findByAlunoIdAndModuloId(userId, module.getId())
                .map(progress -> progress.getStatus() == StatusProgresso.CONCLUIDO)
                .orElse(false));
    }

    private boolean areAllPublishedTopicsComplete(Long userId) {
        List<Modulo> publishedModules = moduloRepository.findByPublicadoTrue();
        return !publishedModules.isEmpty() && publishedModules.stream().allMatch(module ->
            progressoRepository.findByAlunoIdAndModuloId(userId, module.getId())
                .map(progress -> progress.getStatus() == StatusProgresso.CONCLUIDO)
                .orElse(false));
    }

    private UserGamificationProfile getOrCreateProfile(Usuario user, boolean lock) {
        Optional<UserGamificationProfile> existing = lock
            ? profileRepository.findWithLockByUserId(user.getId())
            : profileRepository.findById(user.getId());
        if (existing.isPresent()) {
            return existing.get();
        }
        UserGamificationProfile profile = new UserGamificationProfile();
        // The authenticated principal is detached from the current persistence
        // context. A managed reference is required by the @MapsId association.
        profile.setUser(usuarioRepository.getReferenceById(user.getId()));
        profile.setTotalXp(0);
        profile.setCurrentLevel(GamificationLevel.SPARK);
        profile.setCurrentStreak(0);
        profile.setLongestStreak(0);
        return profileRepository.save(profile);
    }

    private GamificationSummaryDTO buildSummary(
            UserGamificationProfile profile,
            long completedModules,
            long totalModules,
            long unlockedAchievements) {
        GamificationLevel level = profile.getCurrentLevel();
        GamificationLevel next = level.next();
        Integer nextXp = level.getNextLevelXp();
        int progress;
        Integer xpToNext;
        if (nextXp == null) {
            progress = 100;
            xpToNext = 0;
        } else {
            int range = nextXp - level.getMinimumXp();
            progress = Math.min(100, Math.max(0,
                (profile.getTotalXp() - level.getMinimumXp()) * 100 / range));
            xpToNext = Math.max(0, nextXp - profile.getTotalXp());
        }
        return new GamificationSummaryDTO(
            profile.getTotalXp(), level.name(), level.getEnglishName(), level.getEnglishName(),
            level.getMinimumXp(), nextXp, next == null ? null : next.getEnglishName(),
            xpToNext, progress, profile.getCurrentStreak(), profile.getLongestStreak(),
            profile.getLastValidActivityDate(), completedModules, totalModules, unlockedAchievements
        );
    }

    private List<ModuleJourneyDTO> buildModuleJourney(Long userId) {
        return moduloRepository.findByPublicadoTrue().stream()
            .sorted(Comparator.comparing(Modulo::getId))
            .map(module -> {
                long presentationCount = recursoRepository.countByModuloId(module.getId());
                long practiceCount = practiceRepository.countByModuloId(module.getId());
                long productionCount = productionRepository.countByModuloId(module.getId());
                long totalItems = presentationCount + practiceCount + productionCount;
                long completed = progressoItemRepository.countByAlunoIdAndModuloId(userId, module.getId());
                long completedPresentations = progressoItemRepository.countByAlunoIdAndModuloIdAndItemType(
                    userId, module.getId(), ItemType.PRESENTATION);
                long completedPractices = progressoItemRepository.countByAlunoIdAndModuloIdAndItemType(
                    userId, module.getId(), ItemType.PRACTICE);
                long completedProductions = progressoItemRepository.countByAlunoIdAndModuloIdAndItemType(
                    userId, module.getId(), ItemType.PRODUCTION);
                String status = progressoRepository.findByAlunoIdAndModuloId(userId, module.getId())
                    .map(Progresso::getStatus).orElse(StatusProgresso.NAO_INICIADO).name();
                int maximumXp = Math.toIntExact(
                    presentationCount * PRESENTATION_XP + practiceCount * PRACTICE_XP
                    + productionCount * PRODUCTION_XP + (practiceCount > 0 ? PRACTICE_STAGE_XP : 0)
                    + MODULE_XP);
                int earnedXp = Math.toIntExact(
                    completedPresentations * PRESENTATION_XP + completedPractices * PRACTICE_XP
                    + completedProductions * PRODUCTION_XP
                    + (practiceCount > 0 && completedPractices >= practiceCount ? PRACTICE_STAGE_XP : 0)
                    + (StatusProgresso.CONCLUIDO.name().equals(status) ? MODULE_XP : 0));
                return new ModuleJourneyDTO(module.getId(), module.getTitulo(), totalItems,
                    completed, maximumXp, Math.max(0, maximumXp - earnedXp), status);
            }).toList();
    }

    private NextMissionDTO buildNextMission(List<ModuleJourneyDTO> modules) {
        Optional<ModuleJourneyDTO> candidate = modules.stream()
            .filter(module -> !"CONCLUIDO".equals(module.status()))
            .sorted(Comparator
                .comparing((ModuleJourneyDTO module) -> !"EM_ANDAMENTO".equals(module.status()))
                .thenComparing(ModuleJourneyDTO::moduleId))
            .findFirst();
        return candidate.map(module -> new NextMissionDTO(
            module.moduleId(), module.title(), module.completedItems(), module.totalItems(),
            module.remainingXp()
        )).orElse(null);
    }

    private List<XpTimelineEventDTO> getTimelineInternal(Long userId) {
        return xpEventRepository.findTop30ByUserIdOrderByEventDateTimeDesc(userId).stream()
            .map(XpTimelineEventDTO::new).toList();
    }

    private List<StarCapsuleDTO> getStarCapsulesInternal(Long userId) {
        return starCapsuleRepository.findByUserIdOrderByEarnedAtDesc(userId).stream()
            .map(StarCapsuleDTO::new)
            .toList();
    }

    private List<UserRewardItemDTO> getInventoryInternal(Long userId) {
        return userRewardItemRepository.findByUserIdOrderByUnlockedAtDesc(userId).stream()
            .filter(item -> item.getRewardType() != RewardType.COLLECTIBLE_ILLUSTRATION)
            .map(UserRewardItemDTO::new)
            .toList();
    }

    private List<GamificationAchievementDTO> getAchievementsInternal(Long userId) {
        Map<Long, UserAchievement> unlocked = new HashMap<>();
        userAchievementRepository.findByUserIdOrderByUnlockedAtDesc(userId)
            .forEach(item -> unlocked.put(item.getAchievement().getId(), item));
        return achievementRepository.findAllByOrderByCategoryAscNameAsc().stream()
            .map(achievement -> {
                UserAchievement userAchievement = unlocked.get(achievement.getId());
                return userAchievement == null
                    ? GamificationAchievementDTO.locked(achievement)
                    : GamificationAchievementDTO.unlocked(achievement, userAchievement.getUnlockedAt());
            }).toList();
    }

    private record RewardDefinition(
        RewardType type,
        String code,
        String name,
        String description,
        String assetUrl
    ) {}
}
