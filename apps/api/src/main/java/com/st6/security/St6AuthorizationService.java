package com.st6.security;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("st6Authorization")
public class St6AuthorizationService {
    public boolean canReadPlan(Authentication authentication, String ownerId) {
        return hasScope(authentication, "st6:admin")
                || hasScope(authentication, "st6:manager")
                || authentication.getName().equals(ownerId);
    }

    public boolean canWritePlan(Authentication authentication) {
        return hasScope(authentication, "st6:write") || hasScope(authentication, "st6:admin");
    }

    public boolean canReviewTeam(Authentication authentication, String managerId) {
        return hasScope(authentication, "st6:admin")
                || (hasScope(authentication, "st6:manager")
                        && authentication.getName().equals(managerId));
    }

    public boolean canReadOutcomes(Authentication authentication) {
        return hasScope(authentication, "st6:read")
                || hasScope(authentication, "st6:write")
                || hasScope(authentication, "st6:manager")
                || hasScope(authentication, "st6:admin");
    }

    private static boolean hasScope(Authentication authentication, String scope) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("SCOPE_" + scope));
    }
}
