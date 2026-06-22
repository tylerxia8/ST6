package com.st6.config;

import com.st6.domain.CommitCategory;
import com.st6.domain.SupportingOutcome;
import com.st6.domain.WeeklyCommit;
import com.st6.domain.WeeklyPlan;
import com.st6.repository.SupportingOutcomeRepository;
import com.st6.repository.WeeklyPlanRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedData {
    @Bean
    CommandLineRunner seed(
            SupportingOutcomeRepository outcomeRepository, WeeklyPlanRepository planRepository) {
        return args -> {
            if (outcomeRepository.count() > 0) {
                return;
            }

            var outcome =
                    outcomeRepository.save(
                            SupportingOutcome.builder()
                                    .id(UUID.fromString("11111111-1111-1111-1111-111111111111"))
                                    .rallyCry("Win enterprise trust")
                                    .definingObjective("Make strategy execution auditable")
                                    .outcome(
                                            "Every weekly commitment maps to an approved Supporting Outcome")
                                    .owner("Strategy Ops")
                                    .build());

            var plan =
                    WeeklyPlan.builder()
                            .id(UUID.fromString("22222222-2222-2222-2222-222222222222"))
                            .weekStart(LocalDate.of(2026, 6, 22))
                            .ownerId("u-ava")
                            .ownerName("Ava Chen")
                            .managerId("u-morgan")
                            .build();
            plan.addCommit(
                    WeeklyCommit.builder()
                            .id(UUID.fromString("33333333-3333-3333-3333-333333333333"))
                            .supportingOutcome(outcome)
                            .title("Ship RCDO-linked commit form")
                            .description("Require Supporting Outcome mapping on every commit.")
                            .category(CommitCategory.QUEEN)
                            .priority(1)
                            .plannedHours(BigDecimal.valueOf(12))
                            .build());
            planRepository.save(plan);
        };
    }
}
