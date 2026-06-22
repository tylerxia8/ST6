package com.st6.web.dto;

import com.st6.domain.LifecycleState;
import com.st6.domain.WeeklyPlan;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

public record WeeklyPlanResponse(
        UUID id,
        LocalDate weekStart,
        String ownerId,
        String ownerName,
        String managerId,
        LifecycleState lifecycleState,
        Instant submittedAt,
        Instant reviewedAt,
        List<WeeklyCommitResponse> commits) {
    public static WeeklyPlanResponse from(WeeklyPlan plan) {
        return new WeeklyPlanResponse(
                plan.getId(),
                plan.getWeekStart(),
                plan.getOwnerId(),
                plan.getOwnerName(),
                plan.getManagerId(),
                plan.getLifecycleState(),
                plan.getSubmittedAt(),
                plan.getReviewedAt(),
                plan.getCommits().stream()
                        .sorted(Comparator.comparingInt(weeklyCommit -> weeklyCommit.getPriority()))
                        .map(WeeklyCommitResponse::from)
                        .toList());
    }
}
