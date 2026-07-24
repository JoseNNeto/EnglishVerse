package com.joseneto.englishverse.model.enums;

public enum GamificationLevel {
    SPARK(0, 100, "Sparkler"),
    EXPLORER(100, 250, "Explorer"),
    VOYAGER(250, 450, "Voyager"),
    PATHFINDER(450, 700, "Pathfinder"),
    COSMIC_LEGEND(700, null, "Cosmic Legend");

    private final int minimumXp;
    private final Integer nextLevelXp;
    private final String englishName;

    GamificationLevel(int minimumXp, Integer nextLevelXp, String englishName) {
        this.minimumXp = minimumXp;
        this.nextLevelXp = nextLevelXp;
        this.englishName = englishName;
    }

    public int getMinimumXp() { return minimumXp; }
    public Integer getNextLevelXp() { return nextLevelXp; }
    public String getEnglishName() { return englishName; }

    public static GamificationLevel fromXp(int xp) {
        GamificationLevel result = SPARK;
        for (GamificationLevel level : values()) {
            if (xp >= level.minimumXp) {
                result = level;
            }
        }
        return result;
    }

    public GamificationLevel next() {
        int nextOrdinal = ordinal() + 1;
        return nextOrdinal < values().length ? values()[nextOrdinal] : null;
    }
}
