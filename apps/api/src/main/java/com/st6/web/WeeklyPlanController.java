package com.st6.web;

import com.st6.repository.SupportingOutcomeRepository;
import com.st6.service.WeeklyPlanService;
import com.st6.web.dto.CommitRequest;
import com.st6.web.dto.ReconciliationRequest;
import com.st6.web.dto.SupportingOutcomeResponse;
import com.st6.web.dto.TeamMemberSummaryResponse;
import com.st6.web.dto.WeeklyPlanResponse;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class WeeklyPlanController {
    private final WeeklyPlanService weeklyPlanService;
    private final SupportingOutcomeRepository supportingOutcomeRepository;

    public WeeklyPlanController(
            WeeklyPlanService weeklyPlanService,
            SupportingOutcomeRepository supportingOutcomeRepository) {
        this.weeklyPlanService = weeklyPlanService;
        this.supportingOutcomeRepository = supportingOutcomeRepository;
    }

    @GetMapping("/outcomes")
    public java.util.List<SupportingOutcomeResponse> outcomes() {
        return supportingOutcomeRepository.findAll().stream()
                .map(SupportingOutcomeResponse::from)
                .toList();
    }

    @GetMapping("/plans/current")
    public WeeklyPlanResponse currentPlan(
            @RequestParam String ownerId, @RequestParam LocalDate weekStart) {
        return WeeklyPlanResponse.from(weeklyPlanService.getPlan(ownerId, weekStart));
    }

    @PostMapping("/plans/{planId}/commits")
    public WeeklyPlanResponse addCommit(
            @PathVariable UUID planId, @Valid @RequestBody CommitRequest request) {
        return WeeklyPlanResponse.from(weeklyPlanService.addCommit(planId, request));
    }

    @PatchMapping("/plans/{planId}/commits/{commitId}/reconciliation")
    public WeeklyPlanResponse reconcileCommit(
            @PathVariable UUID planId,
            @PathVariable UUID commitId,
            @Valid @RequestBody ReconciliationRequest request) {
        return WeeklyPlanResponse.from(weeklyPlanService.reconcileCommit(planId, commitId, request));
    }

    @PostMapping("/plans/{planId}/lifecycle/advance")
    public WeeklyPlanResponse advanceLifecycle(@PathVariable UUID planId) {
        return WeeklyPlanResponse.from(weeklyPlanService.advanceLifecycle(planId));
    }

    @GetMapping("/managers/{managerId}/plans")
    public Page<TeamMemberSummaryResponse> teamPlans(
            @PathVariable String managerId, @RequestParam LocalDate weekStart, Pageable pageable) {
        return weeklyPlanService
                .getTeamPlans(managerId, weekStart, pageable)
                .map(TeamMemberSummaryResponse::from);
    }
}
