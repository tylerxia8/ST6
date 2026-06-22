package com.st6.web.dto;

import com.st6.domain.CommitCategory;
import com.st6.domain.CommitStatus;
import com.st6.domain.WeeklyCommit;
import java.math.BigDecimal;
import java.util.UUID;

public record WeeklyCommitResponse(
        UUID id,
        String title,
        String description,
        UUID supportingOutcomeId,
        CommitCategory category,
        int priority,
        BigDecimal plannedHours,
        BigDecimal actualHours,
        CommitStatus status,
        String managerNote) {
    public static WeeklyCommitResponse from(WeeklyCommit commit) {
        return new WeeklyCommitResponse(
                commit.getId(),
                commit.getTitle(),
                commit.getDescription(),
                commit.getSupportingOutcome().getId(),
                commit.getCategory(),
                commit.getPriority(),
                commit.getPlannedHours(),
                commit.getActualHours(),
                commit.getStatus(),
                commit.getManagerNote());
    }
}
