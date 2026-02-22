package com.revy.api.admin.server.api.administrator.permission.usecase.impl;

import com.revy.api.admin.server.api.administrator.permission.payload.PermissionPayload;
import com.revy.api.admin.server.api.administrator.permission.usecase.PermissionUseCase;
import com.revy.api.admin.server.common.PageResponse;
import com.revy.api.admin.server.facade.administrator.permission.PermissionProcessor;
import com.revy.api.admin.server.facade.administrator.permission.PermissionReader;
import com.revy.api.admin.server.facade.administrator.permission.dto.PermissionReaderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PermissionUseCaseImpl implements PermissionUseCase {
    private final PermissionProcessor permissionProcessor;
    private final PermissionReader permissionReader;

    @Override
    public PermissionPayload.Res create(PermissionPayload.CreateCommandReq req) {
        UUID permissionId = permissionProcessor.createPermission(req.code(), req.description());
        return get(permissionId);
    }

    @Override
    public PermissionPayload.Res get(UUID permissionId) {
        PermissionReaderDto.PermissionView permission = permissionReader.getPermissionViewById(permissionId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 권한입니다."));
        return toResponse(permission);
    }

    @Override
    public PageResponse<PermissionPayload.Res> getPage(int page, int size, String sortBy, String sortDirection,
                                                       String paramQuery) {
        PermissionReaderDto.PermissionPage result = permissionReader.getPage(page, size);
        return PageResponse.of(
                result.content().stream().map(this::toResponse).toList(),
                result.totalElements(),
                result.page(),
                result.size()
        );
    }

    @Override
    public PermissionPayload.Res update(UUID id, PermissionPayload.UpdateCommandReq req) {
        permissionProcessor.updatePermission(id, req.code(), req.description());
        return get(id);
    }

    @Override
    public void delete(UUID id) {
        permissionProcessor.deletePermission(id);
    }

    private PermissionPayload.Res toResponse(PermissionReaderDto.PermissionView permission) {
        return new PermissionPayload.Res(
                permission.id().toString(),
                permission.code(),
                permission.description(),
                permission.createdAt(),
                permission.updatedAt()
        );
    }
}
