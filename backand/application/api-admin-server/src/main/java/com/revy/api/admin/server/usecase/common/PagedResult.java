package com.revy.api.admin.server.usecase.common;

import java.util.List;

public record PagedResult<T>(
        List<T> content,
        long totalElements,
        int page,
        int size
) {}
