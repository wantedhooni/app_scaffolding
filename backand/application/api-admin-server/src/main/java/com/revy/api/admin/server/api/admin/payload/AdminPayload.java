package com.revy.api.admin.server.api.admin.payload;

import com.revy.domain.admin.enums.AdminStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class AdminPayload {
    @Schema(name = "AdminPayload.CreateReq")
    public record CreateReq(
            @Email
            @NotBlank
            String email,
            @NotBlank
            String password
    ) {
    }

    @Schema(name = "AdminPayload.UpdateReq")
    public record UpdateReq(
            @Email
            String email,
            String password,
            AdminStatus status,
            Boolean enabled,
            List<String> roleIds
    ) {
    }

    @Schema(name = "AdminPayload.UpdateCommandReq")
    public record UpdateCommandReq(
            @NotNull
            String adminId,
            @Email
            String email,
            String password,
            AdminStatus status,
            Boolean enabled,
            List<String> roleIds
    ) {
    }

    @Schema(name = "AdminPayload.DeleteCommandReq")
    public record DeleteCommandReq(
            @NotNull
            String adminId
    ) {
    }

    @Schema(name = "AdminPayload.Res")
    public record Res(
            String id,
            String email,
            String status,
            boolean enabled,
            Set<String> roleIds,
            Set<String> roles,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
    }

    @Schema(name = "AdminPayload.DeleteRes")
    public record DeleteRes(
            String id,
            boolean deleted,
            String message
    ) {
    }
}
