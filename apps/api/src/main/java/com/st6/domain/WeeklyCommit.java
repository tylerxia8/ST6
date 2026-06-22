package com.st6.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "weekly_commits")
public class WeeklyCommit extends AbstractAuditingEntity {
    @Id private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "weekly_plan_id")
    private WeeklyPlan weeklyPlan;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "supporting_outcome_id")
    private SupportingOutcome supportingOutcome;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommitCategory category;

    @Column(nullable = false)
    private int priority;

    @Column(nullable = false)
    private BigDecimal plannedHours;

    @Column(nullable = false)
    private BigDecimal actualHours = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommitStatus status = CommitStatus.PLANNED;

    private String managerNote;

    @Builder
    public WeeklyCommit(
            UUID id,
            SupportingOutcome supportingOutcome,
            String title,
            String description,
            CommitCategory category,
            int priority,
            BigDecimal plannedHours) {
        this.id = id;
        this.supportingOutcome = supportingOutcome;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.plannedHours = plannedHours;
    }
}
