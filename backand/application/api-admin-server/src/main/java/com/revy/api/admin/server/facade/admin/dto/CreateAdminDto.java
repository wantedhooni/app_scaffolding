package com.revy.api.admin.server.facade.admin.dto;

public class CreateAdminDto {
    public record Command(
            String email,
            String rawPassword
    ) {
    }

    public record Result(
            String id,
            String email
    ) {
    }
}
