package com.revy.api.admin.server.facade.administrator.admin.dto;

public class AdminTokenDto {
    public record Result(
            String tokenType,
            String accessToken,
            String refreshToken
    ) {
    }
}
