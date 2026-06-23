package com.st6.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

class St6AuthorizationServiceTest {
    private final St6AuthorizationService authorizationService = new St6AuthorizationService();

    @Test
    void allowsManagerToReviewOwnTeam() {
        var authentication = authentication("u-morgan", "st6:manager");

        assertThat(authorizationService.canReviewTeam(authentication, "u-morgan")).isTrue();
    }

    @Test
    void preventsManagerFromReviewingAnotherManagersTeam() {
        var authentication = authentication("u-morgan", "st6:manager");

        assertThat(authorizationService.canReviewTeam(authentication, "u-other")).isFalse();
    }

    @Test
    void allowsAdminToReviewAnyTeam() {
        var authentication = authentication("u-admin", "st6:admin");

        assertThat(authorizationService.canReviewTeam(authentication, "u-morgan")).isTrue();
    }

    private static UsernamePasswordAuthenticationToken authentication(String name, String scope) {
        return new UsernamePasswordAuthenticationToken(
                name, "credentials", List.of(new SimpleGrantedAuthority("SCOPE_" + scope)));
    }
}
