package com.st6.service;

import com.st6.domain.CommitStatus;
import com.st6.domain.LifecycleState;
import com.st6.domain.WeeklyCommit;
import com.st6.domain.WeeklyPlan;
import com.st6.repository.SupportingOutcomeRepository;
import com.st6.repository.WeeklyPlanRepository;
import com.st6.web.dto.CommitRequest;
import com.st6.web.dto.ReconciliationRequest;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WeeklyPlanService {
    private final WeeklyPlanRepository weeklyPlanRepository;
    private final SupportingOutcomeRepository supportingOutcomeRepository;

    public WeeklyPlanService(
            WeeklyPlanRepository weeklyPlanRepository,
            SupportingOutcomeRepository supportingOutcomeRepository) {
        this.weeklyPlanRepository = weeklyPlanRepository;
        this.supportingOutcomeRepository = supportingOutcomeRepository;
    }

    @Transactional(readOnly = true)
    public WeeklyPlan getPlan(String ownerId, LocalDate weekStart) {
        return weeklyPlanRepository
                .findByOwnerIdAndWeekStart(ownerId, weekStart)
                .orElseThrow(() -> new IllegalArgumentException("Weekly plan not found"));
    }

    @Transactional(readOnly = true)
    public Page<WeeklyPlan> getTeamPlans(String managerId, LocalDate weekStart, Pageable pageable) {
        return weeklyPlanRepository.findByManagerIdAndWeekStart(managerId, weekStart, pageable);
    }

    @Transactional
    public WeeklyPlan addCommit(UUID planId, CommitRequest request) {
        var plan = getEditablePlan(planId);
        var outcome =
                supportingOutcomeRepository
                        .findById(request.supportingOutcomeId())
                        .orElseThrow(() -> new IllegalArgumentException("Supporting outcome not found"));
        plan.addCommit(
                WeeklyCommit.builder()
                        .id(UUID.randomUUID())
                        .supportingOutcome(outcome)
                        .title(request.title())
                        .description(request.description())
                        .category(request.category())
                        .priority(request.priority())
                        .plannedHours(request.plannedHours())
                        .build());
        return weeklyPlanRepository.save(plan);
    }

    @Transactional
    public WeeklyPlan reconcileCommit(UUID planId, UUID commitId, ReconciliationRequest request) {
        var plan = weeklyPlanRepository.findById(planId).orElseThrow();
        if (plan.getLifecycleState() != LifecycleState.RECONCILING) {
            throw new IllegalStateException("Actuals can only be changed while reconciling");
        }

        var commit =
                plan.getCommits().stream()
                        .filter(candidate -> candidate.getId().equals(commitId))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("Commit not found"));
        commit.setActualHours(request.actualHours());
        commit.setStatus(request.status());
        commit.setManagerNote(request.managerNote());
        return weeklyPlanRepository.save(plan);
    }

    @Transactional
    public WeeklyPlan deleteCommit(UUID planId, UUID commitId) {
        var plan = getEditablePlan(planId);
        var removed = plan.getCommits().removeIf(commit -> commit.getId().equals(commitId));
        if (!removed) {
            throw new IllegalArgumentException("Commit not found");
        }
        return weeklyPlanRepository.save(plan);
    }

    @Transactional
    public WeeklyPlan advanceLifecycle(UUID planId) {
        var plan = weeklyPlanRepository.findById(planId).orElseThrow();
        switch (plan.getLifecycleState()) {
            case DRAFT -> {
                plan.setLifecycleState(LifecycleState.LOCKED);
                plan.setSubmittedAt(Instant.now());
            }
            case LOCKED -> plan.setLifecycleState(LifecycleState.RECONCILING);
            case RECONCILING -> {
                plan.setLifecycleState(LifecycleState.RECONCILED);
                plan.setReviewedAt(Instant.now());
            }
            case RECONCILED -> {
                plan.setLifecycleState(LifecycleState.DRAFT);
                plan.setSubmittedAt(null);
                plan.setReviewedAt(null);
                plan.getCommits().forEach(commit -> {
                    if (commit.getStatus() == CommitStatus.CARRIED_FORWARD) {
                        commit.setStatus(CommitStatus.PLANNED);
                        commit.setActualHours(java.math.BigDecimal.ZERO);
                    }
                });
            }
        }
        return weeklyPlanRepository.save(plan);
    }

    private WeeklyPlan getEditablePlan(UUID planId) {
        var plan = weeklyPlanRepository.findById(planId).orElseThrow();
        if (plan.getLifecycleState() != LifecycleState.DRAFT) {
            throw new IllegalStateException("Commit changes are only allowed in draft");
        }
        return plan;
    }
}
