package com.st6.web.dto;

import com.st6.domain.CommitCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record CommitRequest(
        @NotBlank String title,
        String description,
        @NotNull UUID supportingOutcomeId,
        @NotNull CommitCategory category,
        @Min(1) int priority,
        @NotNull @DecimalMin("0.25") BigDecimal plannedHours) {}
