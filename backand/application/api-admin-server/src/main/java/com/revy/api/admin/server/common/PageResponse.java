package com.revy.api.admin.server.common;

import java.util.List;

public record PageResponse<T>(
        List<T> content,
        long totalElements,
        int totalPages,
        int page,
        int size
) {
    public static <T> PageResponse<T> of(List<T> content, long totalElements, int page, int size) {
        int safeSize = Math.max(size, 1);
        int totalPages = (int) Math.ceil((double) totalElements / safeSize);
        return new PageResponse<>(content, totalElements, totalPages, page, size);
    }
}
