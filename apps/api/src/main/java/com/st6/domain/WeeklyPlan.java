package com.st6.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "weekly_plans")
public class WeeklyPlan extends AbstractAuditingEntity {
    @Id private UUID id;

    @Column(nullable = false)
    private LocalDate weekStart;

    @Column(nullable = false)
    private String ownerId;

    @Column(nullable = false)
    private String ownerName;

    @Column(nullable = false)
    private String managerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LifecycleState lifecycleState;

    private Instant submittedAt;

    private Instant reviewedAt;

    @OrderBy("priority ASC")
    @OneToMany(mappedBy = "weeklyPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WeeklyCommit> commits = new ArrayList<>();

    @Builder
    public WeeklyPlan(UUID id, LocalDate weekStart, String ownerId, String ownerName, String managerId) {
        this.id = id;
        this.weekStart = weekStart;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.managerId = managerId;
        this.lifecycleState = LifecycleState.DRAFT;
    }

    public void addCommit(WeeklyCommit commit) {
        commits.add(commit);
        commit.setWeeklyPlan(this);
    }
}
