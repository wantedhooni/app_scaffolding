package com.revy.api.admin.server.api.user.usecase;

import com.revy.api.admin.server.api.user.payload.UserPayload;
import com.revy.api.admin.server.common.PageResponse;

import java.util.UUID;

public interface UserUseCase {
    PageResponse<UserPayload.Res> getPage(int page, int size, String sortBy, String sortDirection, String paramQuery);

    UserPayload.Res create(UserPayload.CreateReq req);

    UserPayload.Res get(UUID id);

    UserPayload.Res update(UUID id, UserPayload.UpdateReq req);

    void delete(UUID id);
}
