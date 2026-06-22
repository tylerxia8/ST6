package com.st6.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.st6.domain.CommitCategory;
import com.st6.domain.CommitStatus;
import com.st6.domain.LifecycleState;
import com.st6.domain.SupportingOutcome;
import com.st6.domain.WeeklyPlan;
import com.st6.repository.SupportingOutcomeRepository;
import com.st6.repository.WeeklyPlanRepository;
import com.st6.web.dto.CommitRequest;
import com.st6.web.dto.ReconciliationRequest;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
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
    void deletesCommitWhilePlanIsDraft() {
        var plan =
                weeklyPlanService.addCommit(
                        planId,
                        new CommitRequest(
                                "Remove me",
                                null,
                                outcomeId,
                                CommitCategory.PAWN,
                                1,
                                BigDecimal.ONE));
        var commitId = plan.getCommits().getFirst().getId();

        var updated = weeklyPlanService.deleteCommit(planId, commitId);

        assertThat(updated.getCommits()).isEmpty();
    }

    @Test
    void advancesThroughLifecycle() {
        var locked = weeklyPlanService.advanceLifecycle(planId);
        assertThat(locked.getLifecycleState()).isEqualTo(LifecycleState.LOCKED);

        var reconciling = weeklyPlanService.advanceLifecycle(planId);
        assertThat(reconciling.getLifecycleState()).isEqualTo(LifecycleState.RECONCILING);

        var reconciled = weeklyPlanService.advanceLifecycle(planId);
        assertThat(reconciled.getLifecycleState()).isEqualTo(LifecycleState.RECONCILED);
    }

    @Test
    void reconcilesCommitActualsWhilePlanIsReconciling() {
        var plan =
                weeklyPlanService.addCommit(
                        planId,
                        new CommitRequest(
                                "Reconcile actuals",
                                null,
                                outcomeId,
                                CommitCategory.ROOK,
                                2,
                                BigDecimal.valueOf(6)));
        var commitId = plan.getCommits().getFirst().getId();
        weeklyPlanService.advanceLifecycle(planId);
        weeklyPlanService.advanceLifecycle(planId);

        var updated =
                weeklyPlanService.reconcileCommit(
                        planId,
                        commitId,
                        new ReconciliationRequest(
                                BigDecimal.valueOf(7), CommitStatus.DONE, "Reviewed by manager"));

        var commit = updated.getCommits().getFirst();
        assertThat(commit.getActualHours()).isEqualByComparingTo("7");
        assertThat(commit.getStatus()).isEqualTo(CommitStatus.DONE);
        assertThat(commit.getManagerNote()).isEqualTo("Reviewed by manager");
    }

    @Test
    void buildsManagerDashboardFromTeamPlans() {
        weeklyPlanService.addCommit(
                planId,
                new CommitRequest(
                        "Summarize dashboard",
                        null,
                        outcomeId,
                        CommitCategory.BISHOP,
                        1,
                        BigDecimal.valueOf(4)));
        weeklyPlanService.advanceLifecycle(planId);

        var dashboard =
                weeklyPlanService.getManagerDashboard(
                        "m-1", LocalDate.of(2026, 6, 22), PageRequest.of(0, 20));

        assertThat(dashboard.completionRate()).isEqualTo(100);
        assertThat(dashboard.alignmentRate()).isEqualTo(100);
        assertThat(dashboard.teamMembers()).hasSize(1);
        assertThat(dashboard.teamMembers().getFirst().plannedHours()).isEqualByComparingTo("4");
    }

    @Test
    void startsNextDraftByResettingCarriedForwardCommits() {
        var plan =
                weeklyPlanService.addCommit(
                        planId,
                        new CommitRequest(
                                "Carry forward",
                                null,
                                outcomeId,
                                CommitCategory.KNIGHT,
                                3,
                                BigDecimal.valueOf(5)));
        var commitId = plan.getCommits().getFirst().getId();
        weeklyPlanService.advanceLifecycle(planId);
        weeklyPlanService.advanceLifecycle(planId);
        weeklyPlanService.reconcileCommit(
                planId,
                commitId,
                new ReconciliationRequest(
                        BigDecimal.valueOf(2), CommitStatus.CARRIED_FORWARD, "Move to next week"));
        weeklyPlanService.advanceLifecycle(planId);

        var nextDraft = weeklyPlanService.advanceLifecycle(planId);

        assertThat(nextDraft.getLifecycleState()).isEqualTo(LifecycleState.DRAFT);
        assertThat(nextDraft.getSubmittedAt()).isNull();
        assertThat(nextDraft.getReviewedAt()).isNull();
        assertThat(nextDraft.getCommits().getFirst().getStatus()).isEqualTo(CommitStatus.PLANNED);
        assertThat(nextDraft.getCommits().getFirst().getActualHours()).isEqualByComparingTo("0");
    }

    @Test
    void returnsEmptyManagerDashboardWhenNoPlansMatch() {
        var dashboard =
                weeklyPlanService.getManagerDashboard(
                        "missing-manager", LocalDate.of(2026, 6, 22), PageRequest.of(0, 20));

        assertThat(dashboard.completionRate()).isZero();
        assertThat(dashboard.alignmentRate()).isZero();
        assertThat(dashboard.teamMembers()).isEmpty();
    }
}
