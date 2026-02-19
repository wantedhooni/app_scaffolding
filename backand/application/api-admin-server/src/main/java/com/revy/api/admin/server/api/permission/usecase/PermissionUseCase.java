package com.revy.api.admin.server.api.permission.usecase;

import com.revy.api.admin.server.api.permission.payload.PermissionPayload;
import com.revy.api.admin.server.common.PageResponse;

import java.util.UUID;

public interface PermissionUseCase {
    PermissionPayload.Res create(PermissionPayload.CreateCommandReq req);

    PermissionPayload.Res get(UUID permissionId);

    PageResponse<PermissionPayload.Res> getPage(int page, int size);

    PermissionPayload.Res update(PermissionPayload.UpdateCommandReq req);

    PermissionPayload.DeleteRes delete(PermissionPayload.DeleteCommandReq req);
}
