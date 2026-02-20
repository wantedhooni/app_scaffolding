package com.revy.api.admin.server.common.usecase;

import com.revy.api.admin.server.common.PageResponse;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public abstract class BaseCrudUseCaseImpl<CREQ, UREQ, DREQ, VIEW, RES, DRES>
        implements BaseCrudUseCase<CREQ, UREQ, DREQ, RES, DRES> {

    @Override
    public RES create(CREQ req) {
        UUID createdId = doCreate(req);
        return get(createdId);
    }

    @Override
    public RES get(UUID id) {
        VIEW view = findViewById(id)
                .orElseThrow(() -> new IllegalArgumentException(notFoundMessage()));
        return toResponse(view);
    }

    @Override
    public PageResponse<RES> getPage(int page, int size) {
        BasePageResult<VIEW> result = findViewPage(page, size);
        return PageResponse.of(
                result.content().stream().map(this::toResponse).toList(),
                result.totalElements(),
                result.page(),
                result.size()
        );
    }

    @Override
    public RES update(UREQ req) {
        UUID updatedId = doUpdate(req);
        return get(updatedId);
    }

    protected abstract UUID doCreate(CREQ req);

    protected abstract Optional<VIEW> findViewById(UUID id);

    protected abstract BasePageResult<VIEW> findViewPage(int page, int size);

    protected abstract UUID doUpdate(UREQ req);

    protected abstract RES toResponse(VIEW view);

    protected abstract String notFoundMessage();

    public record BasePageResult<T>(
            List<T> content,
            long totalElements,
            int page,
            int size
    ) {
    }
}
