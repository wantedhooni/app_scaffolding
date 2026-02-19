package com.revy.api.admin.server.facade.admin.dto;

import com.revy.domain.admin.enums.UserStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public class AdminReaderDto {
    public record RoleRef(
            UUID id,
            String name
    ) {
    }

    public record AuthAdmin(
            UUID id,
            String email,
            String encodedPassword,
            UserStatus status,
            boolean enabled,
            Set<String> roleNames
    ) {
    }

    public record AdminView(
            UUID id,
            String email,
            UserStatus status,
            boolean enabled,
            Set<String> roleNames,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
    }

    public record AdminPage(
            List<AdminView> content,
            long totalElements,
            int page,
            int size
    ) {
    }
}
