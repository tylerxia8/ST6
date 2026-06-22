package com.st6.web.dto;

import com.st6.domain.SupportingOutcome;
import java.util.UUID;

public record SupportingOutcomeResponse(
        UUID id, String rallyCry, String definingObjective, String outcome, String owner) {
    public static SupportingOutcomeResponse from(SupportingOutcome outcome) {
        return new SupportingOutcomeResponse(
                outcome.getId(),
                outcome.getRallyCry(),
                outcome.getDefiningObjective(),
                outcome.getOutcome(),
                outcome.getOwner());
    }
}
