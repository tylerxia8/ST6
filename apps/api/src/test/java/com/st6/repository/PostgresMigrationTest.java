package com.st6.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.st6.domain.SupportingOutcome;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers
class PostgresMigrationTest {
    @Container
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16.4")
                    .withDatabaseName("st6")
                    .withUsername("st6")
                    .withPassword("st6");

    @DynamicPropertySource
    static void postgresProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired SupportingOutcomeRepository supportingOutcomeRepository;

    @Test
    void flywaySchemaSupportsSupportingOutcomePersistence() {
        var outcome =
                supportingOutcomeRepository.save(
                        SupportingOutcome.builder()
                                .id(UUID.randomUUID())
                                .rallyCry("Increase execution discipline")
                                .definingObjective("Improve reconciliation accuracy")
                                .outcome("Planned vs actual variance is visible by Friday")
                                .owner("Finance Ops")
                                .build());

        assertThat(supportingOutcomeRepository.findById(outcome.getId())).isPresent();
    }
}
