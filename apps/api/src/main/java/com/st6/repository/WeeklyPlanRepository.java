package com.st6.repository;

import com.st6.domain.WeeklyPlan;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WeeklyPlanRepository extends JpaRepository<WeeklyPlan, UUID> {
    @EntityGraph(attributePaths = {"commits", "commits.supportingOutcome"})
    Optional<WeeklyPlan> findByOwnerIdAndWeekStart(String ownerId, LocalDate weekStart);

    @EntityGraph(attributePaths = {"commits", "commits.supportingOutcome"})
    @Query("select plan from WeeklyPlan plan where plan.id = :id")
    Optional<WeeklyPlan> findDetailedById(UUID id);

    Page<WeeklyPlan> findByManagerIdAndWeekStart(String managerId, LocalDate weekStart, Pageable pageable);
}
