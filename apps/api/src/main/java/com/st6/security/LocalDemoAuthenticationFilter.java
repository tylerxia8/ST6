package com.st6.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Profile("local")
public class LocalDemoAuthenticationFilter extends OncePerRequestFilter {
    private static final List<SimpleGrantedAuthority> AUTHORITIES =
            List.of(
                    new SimpleGrantedAuthority("SCOPE_st6:read"),
                    new SimpleGrantedAuthority("SCOPE_st6:write"),
                    new SimpleGrantedAuthority("SCOPE_st6:manager"));

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            SecurityContextHolder.getContext()
                    .setAuthentication(
                            new UsernamePasswordAuthenticationToken("u-ava", "local-demo", AUTHORITIES));
        }

        filterChain.doFilter(request, response);
    }
}
