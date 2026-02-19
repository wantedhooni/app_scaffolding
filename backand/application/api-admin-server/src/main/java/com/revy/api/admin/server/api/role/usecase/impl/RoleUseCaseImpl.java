package com.revy.api.admin.server.api.role.usecase.impl;

import com.revy.api.admin.server.api.role.payload.RolePayload;
import com.revy.api.admin.server.api.role.usecase.RoleUseCase;
import com.revy.api.admin.server.common.PageResponse;
import com.revy.api.admin.server.facade.role.RoleProcessor;
import com.revy.api.admin.server.facade.role.RoleReader;
import com.revy.api.admin.server.facade.role.dto.RoleReaderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleUseCaseImpl implements RoleUseCase {
    private final RoleProcessor roleProcessor;
    private final RoleReader roleReader;

    @Override
    public RolePayload.Res create(RolePayload.CreateCommandReq req) {
        UUID roleId = roleProcessor.createRole(req.name(), req.description());
        return get(roleId);
    }

    @Override
    public RolePayload.Res get(UUID roleId) {
        RoleReaderDto.RoleView role = roleReader.getRoleViewById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 역할입니다."));
        return toResponse(role);
    }

    @Override
    public PageResponse<RolePayload.Res> getPage(int page, int size) {
        RoleReaderDto.RolePage result = roleReader.getRoleViewPage(page, size);
        return PageResponse.of(
                result.content().stream().map(this::toResponse).toList(),
                result.totalElements(),
                result.page(),
                result.size()
        );
    }

    @Override
    public RolePayload.Res update(RolePayload.UpdateCommandReq req) {
        UUID roleId = UUID.fromString(req.roleId());
        roleProcessor.updateRole(roleId, req.name(), req.description());
        return get(roleId);
    }

    @Override
    public RolePayload.DeleteRes delete(RolePayload.DeleteCommandReq req) {
        UUID roleId = UUID.fromString(req.roleId());
        roleProcessor.deleteRole(roleId);
        return new RolePayload.DeleteRes(roleId.toString(), true, "역할이 삭제되었습니다.");
    }

    @Override
    public RolePayload.Res addAdmin(RolePayload.AddAdminCommandReq req) {
        UUID roleId = UUID.fromString(req.roleId());
        UUID adminId = UUID.fromString(req.adminId());
        roleProcessor.addAdminToRole(roleId, adminId);
        return get(roleId);
    }

    private RolePayload.Res toResponse(RoleReaderDto.RoleView role) {
        return new RolePayload.Res(
                role.id().toString(),
                role.name(),
                role.description(),
                role.admins().stream()
                        .map(admin -> new RolePayload.AdminRef(admin.id().toString(), admin.email()))
                        .toList(),
                role.createdAt(),
                role.updatedAt()
        );
    }
}
