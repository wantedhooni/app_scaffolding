package com.revy.api.admin.server.infra.filter;

import com.revy.api.admin.server.facade.admin.AdminReader;
import com.revy.api.admin.server.facade.admin.dto.AdminReaderDto;
import com.revy.domain.admin.enums.AdminStatus;
import com.revy.jwt.provider.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtTokenProvider jwtTokenProvider;
    private final AdminReader adminReader;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (bearerToken == null || bearerToken.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        if (!bearerToken.startsWith(BEARER_PREFIX)) {
            throw new BadCredentialsException("Invalid authorization header");
        }

        String token = bearerToken.substring(BEARER_PREFIX.length());
        if (!jwtTokenProvider.validateToken(token)) {
            throw new BadCredentialsException("Invalid access token");
        }

        String userId = jwtTokenProvider.getUserId(token);
        UUID adminId;
        try {
            adminId = UUID.fromString(userId);
        } catch (IllegalArgumentException e) {
            throw new BadCredentialsException("Invalid access token");
        }

        AdminReaderDto.AuthAdmin admin = adminReader.getAuthAdminById(adminId)
                .orElseThrow(() -> new BadCredentialsException("Invalid access token"));
        if (!admin.enabled() || admin.status() != AdminStatus.ACTIVE) {
            throw new BadCredentialsException("Inactive account");
        }

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                admin.id().toString(),
                null,
                admin.roleNames().stream().map(SimpleGrantedAuthority::new).toList()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }
}
