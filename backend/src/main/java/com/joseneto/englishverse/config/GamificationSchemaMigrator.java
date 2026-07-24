package com.joseneto.englishverse.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(0)
public class GamificationSchemaMigrator implements CommandLineRunner {
    private final JdbcTemplate jdbcTemplate;

    public GamificationSchemaMigrator(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        replaceCheckConstraint(
            "achievements",
            "achievements_category_check",
            "category in ('CONSISTENCY', 'CONTENT_MASTERY', 'POP_CULTURE')"
        );
        replaceCheckConstraint(
            "xp_events",
            "xp_events_type_check",
            "type in ('PRESENTATION_COMPLETED', 'PRACTICE_COMPLETED', 'PRODUCTION_SUBMITTED', "
                + "'ACTIVITY_REPEATED', "
                + "'PRACTICE_STAGE_COMPLETED', 'MODULE_COMPLETED', 'TOPIC_COMPLETED', "
                + "'DAILY_ACTIVITY_BONUS', 'STAR_CAPSULE_OPENED')"
        );
        replaceCheckConstraint(
            "xp_events",
            "xp_events_source_type_check",
            "source_type in ('PRESENTATION', 'PRACTICE', 'PRODUCTION', 'MODULE', 'TOPIC', "
                + "'DAILY_BONUS', 'STAR_CAPSULE')"
        );
        // Clear the former broad LITERATURE value before Hibernate reads it with
        // the new, more specific POETRY and COMICS enum values. The content
        // seeder below reclassifies each of those items precisely.
        jdbcTemplate.update("update recursos_apresentacao set media_category = null where media_category = 'LITERATURE'");
        jdbcTemplate.update("update practice_atividades set media_category = null where media_category = 'LITERATURE'");
        jdbcTemplate.update("update production_challenges set media_category = null where media_category = 'LITERATURE'");

        String mediaCategories = "media_category in ('FILM', 'SERIES', 'MUSIC', 'POETRY', 'COMICS')";
        replaceCheckConstraint(
            "recursos_apresentacao",
            "recursos_apresentacao_media_category_check",
            mediaCategories
        );
        replaceCheckConstraint(
            "practice_atividades",
            "practice_atividades_media_category_check",
            mediaCategories
        );
        replaceCheckConstraint(
            "production_challenges",
            "production_challenges_media_category_check",
            mediaCategories
        );

        // The temporary AI-generated Pop Culture collectible was removed from
        // the product. Clear its legacy inventory records and capsule metadata.
        jdbcTemplate.update(
            "delete from user_reward_items where reward_type = 'COLLECTIBLE_ILLUSTRATION'"
        );
        jdbcTemplate.update(
            "update category_star_capsules set special_reward_type = null, special_reward_code = null "
                + "where category = 'POP_CULTURE'"
        );
    }

    private void replaceCheckConstraint(String table, String constraint, String condition) {
        jdbcTemplate.execute("alter table " + table + " drop constraint if exists " + constraint);
        jdbcTemplate.execute(
            "alter table " + table + " add constraint " + constraint + " check (" + condition + ")"
        );
    }
}
