package com.revy.api.admin.server.common.usecase;

import com.revy.api.admin.server.common.PageResponse;

import java.util.UUID;

public interface BaseCrudUseCase<CREQ, UREQ, DREQ, RES, DRES> {
    RES create(CREQ req);

    RES get(UUID id);

    PageResponse<RES> getPage(int page, int size);

    RES update(UREQ req);

    DRES delete(DREQ req);
}
