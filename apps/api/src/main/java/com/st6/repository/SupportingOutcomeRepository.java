package com.st6.repository;

import com.st6.domain.SupportingOutcome;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportingOutcomeRepository extends JpaRepository<SupportingOutcome, UUID> {}
