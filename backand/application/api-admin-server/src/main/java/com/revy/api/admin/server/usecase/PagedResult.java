package com.revy.api.admin.server.usecase;

public record PagedResult<T>(
        java.util.List<T> content,
        long totalElements,
        int page,
        int size
) {}
