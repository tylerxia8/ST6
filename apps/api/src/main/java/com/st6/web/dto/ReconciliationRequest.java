package com.st6.web.dto;

import com.st6.domain.CommitStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ReconciliationRequest(
        @NotNull @DecimalMin("0.00") BigDecimal actualHours,
        @NotNull CommitStatus status,
        String managerNote) {}
