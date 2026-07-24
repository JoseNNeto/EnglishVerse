package com.joseneto.englishverse.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.joseneto.englishverse.dtos.GamificationAchievementDTO;
import com.joseneto.englishverse.dtos.GamificationJourneyDTO;
import com.joseneto.englishverse.dtos.GamificationSummaryDTO;
import com.joseneto.englishverse.dtos.StarCapsuleOpenDTO;
import com.joseneto.englishverse.dtos.StarCapsuleOpenRequestDTO;
import com.joseneto.englishverse.dtos.UserRewardItemDTO;
import com.joseneto.englishverse.dtos.XpTimelineEventDTO;
import com.joseneto.englishverse.model.Usuario;
import com.joseneto.englishverse.service.GamificationService;

@RestController
@RequestMapping("/api/gamification")
public class GamificationController {
    private final GamificationService gamificationService;

    public GamificationController(GamificationService gamificationService) {
        this.gamificationService = gamificationService;
    }

    @GetMapping("/me")
    public ResponseEntity<GamificationSummaryDTO> getSummary(@AuthenticationPrincipal Usuario user) {
        return ResponseEntity.ok(gamificationService.getSummary(user));
    }

    @GetMapping("/me/journey")
    public ResponseEntity<GamificationJourneyDTO> getJourney(@AuthenticationPrincipal Usuario user) {
        return ResponseEntity.ok(gamificationService.getJourney(user));
    }

    @GetMapping("/me/timeline")
    public ResponseEntity<List<XpTimelineEventDTO>> getTimeline(@AuthenticationPrincipal Usuario user) {
        return ResponseEntity.ok(gamificationService.getTimeline(user.getId()));
    }

    @GetMapping("/me/achievements")
    public ResponseEntity<List<GamificationAchievementDTO>> getAchievements(
            @AuthenticationPrincipal Usuario user) {
        return ResponseEntity.ok(gamificationService.getAchievements(user.getId()));
    }

    @PostMapping("/me/capsules/{capsuleId}/open")
    public ResponseEntity<StarCapsuleOpenDTO> openStarCapsule(
            @AuthenticationPrincipal Usuario user,
            @PathVariable Long capsuleId,
            @RequestBody(required = false) StarCapsuleOpenRequestDTO request) {
        return ResponseEntity.ok(gamificationService.openStarCapsule(
            user,
            capsuleId,
            request == null ? null : request.selectedRewardType()
        ));
    }

    @PutMapping("/me/inventory/{itemId}/equip")
    public ResponseEntity<UserRewardItemDTO> equipInventoryItem(
            @AuthenticationPrincipal Usuario user,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(gamificationService.equipInventoryItem(user, itemId));
    }
}
