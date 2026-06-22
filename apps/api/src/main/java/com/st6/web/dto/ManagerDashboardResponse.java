package com.st6.web.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ManagerDashboardResponse(
        LocalDate weekStart,
        int completionRate,
        int alignmentRate,
        BigDecimal reviewTurnaroundHours,
        List<TeamMemberSummaryResponse> teamMembers) {}
