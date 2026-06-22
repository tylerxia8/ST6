package com.st6.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.st6.domain.CommitCategory;
import com.st6.domain.LifecycleState;
import com.st6.domain.SupportingOutcome;
import com.st6.domain.WeeklyPlan;
import com.st6.repository.SupportingOutcomeRepository;
import com.st6.repository.WeeklyPlanRepository;
import com.st6.web.dto.CommitRequest;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class WeeklyPlanServiceTest {
    @Autowired private WeeklyPlanService weeklyPlanService;
    @Autowired private WeeklyPlanRepository weeklyPlanRepository;
    @Autowired private SupportingOutcomeRepository supportingOutcomeRepository;

    private UUID planId;
    private UUID outcomeId;

    @BeforeEach
    void setUp() {
        weeklyPlanRepository.deleteAll();
        supportingOutcomeRepository.deleteAll();
        outcomeId = UUID.randomUUID();
        var outcome =
                supportingOutcomeRepository.save(
                        SupportingOutcome.builder()
                                .id(outcomeId)
                                .rallyCry("Win enterprise trust")
                                .definingObjective("Make strategy auditable")
                                .outcome("Every commit links to RCDO")
                                .owner("Strategy Ops")
                                .build());
        var plan =
                WeeklyPlan.builder()
                        .id(UUID.randomUUID())
                        .weekStart(LocalDate.of(2026, 6, 22))
                        .ownerId("u-1")
                        .ownerName("Ava Chen")
                        .managerId("m-1")
                        .build();
        planId = weeklyPlanRepository.save(plan).getId();
        assertThat(outcome.getId()).isEqualTo(outcomeId);
    }

    @Test
    void addsCommitWhilePlanIsDraft() {
        var plan =
                weeklyPlanService.addCommit(
                        planId,
                        new CommitRequest(
                                "Write weekly plan form",
                                "Require RCDO mapping",
                                outcomeId,
                                CommitCategory.QUEEN,
                                1,
                                BigDecimal.valueOf(8)));

        assertThat(plan.getCommits()).hasSize(1);
        assertThat(plan.getCommits().getFirst().getSupportingOutcome().getId()).isEqualTo(outcomeId);
    }

    @Test
    void preventsCommitChangesAfterLock() {
        weeklyPlanService.advanceLifecycle(planId);

        assertThatThrownBy(
                        () ->
                                weeklyPlanService.addCommit(
                                        planId,
                                        new CommitRequest(
                                                "Late work",
                                                null,
                                                outcomeId,
                                                CommitCategory.PAWN,
                                                9,
                                                BigDecimal.ONE)))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void advancesThroughLifecycle() {
        var locked = weeklyPlanService.advanceLifecycle(planId);
        var reconciling = weeklyPlanService.advanceLifecycle(planId);
        var reconciled = weeklyPlanService.advanceLifecycle(planId);

        assertThat(locked.getLifecycleState()).isEqualTo(LifecycleState.LOCKED);
        assertThat(reconciling.getLifecycleState()).isEqualTo(LifecycleState.RECONCILING);
        assertThat(reconciled.getLifecycleState()).isEqualTo(LifecycleState.RECONCILED);
    }
}
