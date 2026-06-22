package com.st6.web.dto;

import com.st6.domain.LifecycleState;
import com.st6.domain.WeeklyPlan;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

public record TeamMemberSummaryResponse(
        UUID id,
        String ownerId,
        String name,
        LifecycleState lifecycleState,
        int alignment,
        BigDecimal plannedHours,
        BigDecimal actualHours,
        long blockedCommits) {
    public static TeamMemberSummaryResponse from(WeeklyPlan plan) {
        var commits = plan.getCommits();
        var linked = commits.stream().filter(commit -> commit.getSupportingOutcome() != null).count();
        var alignment =
                commits.isEmpty() ? 0 : BigDecimal.valueOf(linked * 100)
                        .divide(BigDecimal.valueOf(commits.size()), 0, RoundingMode.HALF_UP)
                        .intValue();
        var planned =
                commits.stream()
                        .map(commit -> commit.getPlannedHours())
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
        var actual =
                commits.stream()
                        .map(commit -> commit.getActualHours())
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
        var blocked =
                commits.stream()
                        .filter(commit -> commit.getStatus().name().equals("BLOCKED"))
                        .count();

        return new TeamMemberSummaryResponse(
                plan.getId(),
                plan.getOwnerId(),
                plan.getOwnerName(),
                plan.getLifecycleState(),
                alignment,
                planned,
                actual,
                blocked);
    }
}
