package com.revy.api.admin.server.api.role.usecase;

import com.revy.api.admin.server.api.role.payload.RolePayload;
import com.revy.api.admin.server.common.PageResponse;

import java.util.UUID;

public interface RoleUseCase {
    RolePayload.Res create(RolePayload.CreateCommandReq req);

    RolePayload.Res get(UUID roleId);

    PageResponse<RolePayload.Res> getPage(int page, int size);

    RolePayload.Res update(RolePayload.UpdateCommandReq req);

    RolePayload.DeleteRes delete(RolePayload.DeleteCommandReq req);

    RolePayload.Res addAdmin(RolePayload.AddAdminCommandReq req);
}
