package com.st6.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "supporting_outcomes")
public class SupportingOutcome extends AbstractAuditingEntity {
    @Id private UUID id;

    @Column(nullable = false)
    private String rallyCry;

    @Column(nullable = false)
    private String definingObjective;

    @Column(nullable = false)
    private String outcome;

    @Column(nullable = false)
    private String owner;

    @Builder
    public SupportingOutcome(UUID id, String rallyCry, String definingObjective, String outcome, String owner) {
        this.id = id;
        this.rallyCry = rallyCry;
        this.definingObjective = definingObjective;
        this.outcome = outcome;
        this.owner = owner;
    }
}
