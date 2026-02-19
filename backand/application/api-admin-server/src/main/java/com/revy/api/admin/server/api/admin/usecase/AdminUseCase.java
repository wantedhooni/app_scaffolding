package com.revy.api.admin.server.api.admin.usecase;

import com.revy.api.admin.server.api.admin.payload.AdminPayload;
import com.revy.api.admin.server.common.PageResponse;

import java.util.UUID;

public interface AdminUseCase {
    AdminPayload.Res create(AdminPayload.CreateReq req);

    AdminPayload.Res get(UUID adminId);

    PageResponse<AdminPayload.Res> getPage(int page, int size);

    AdminPayload.Res update(UUID adminId, AdminPayload.UpdateReq req);

    AdminPayload.DeleteRes delete(UUID adminId);
}
