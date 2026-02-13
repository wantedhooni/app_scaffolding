package com.revy.api.admin.server.common;

public record ApiError(
        String code,
        String message,
        java.util.Map<String, String> fieldErrors
) {
}
