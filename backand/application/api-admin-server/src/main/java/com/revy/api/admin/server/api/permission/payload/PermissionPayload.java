package com.revy.api.admin.server.api.permission.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class PermissionPayload {
    @Schema(name = "PermissionPayload.CreateCommandReq")
    public record CreateCommandReq(
            @NotBlank
            String code,
            String description
    ) {
    }

    @Schema(name = "PermissionPayload.UpdateCommandReq")
    public record UpdateCommandReq(
            @NotNull
            String permissionId,
            String code,
            String description
    ) {
    }

    @Schema(name = "PermissionPayload.DeleteCommandReq")
    public record DeleteCommandReq(
            @NotNull
            String permissionId
    ) {
    }

    @Schema(name = "PermissionPayload.Res")
    public record Res(
            String id,
            String code,
            String description,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
    }

    @Schema(name = "PermissionPayload.DeleteRes")
    public record DeleteRes(
            String id,
            boolean deleted,
            String message
    ) {
    }
}
