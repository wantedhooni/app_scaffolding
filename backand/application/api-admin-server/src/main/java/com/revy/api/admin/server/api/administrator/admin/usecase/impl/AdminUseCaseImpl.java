package com.revy.api.admin.server.api.administrator.admin.usecase.impl;

import com.revy.api.admin.server.api.administrator.admin.payload.AdminPayload;
import com.revy.api.admin.server.api.administrator.admin.usecase.AdminUseCase;
import com.revy.api.admin.server.common.PageResponse;
import com.revy.api.admin.server.facade.administrator.admin.AdminProcessor;
import com.revy.api.admin.server.facade.administrator.admin.AdminReader;
import com.revy.api.admin.server.facade.administrator.admin.dto.AdminReaderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminUseCaseImpl implements AdminUseCase {
    private final AdminProcessor adminProcessor;
    private final AdminReader adminReader;

    @Override
    public AdminPayload.Res create(AdminPayload.CreateReq req) {
        String createdId = adminProcessor.createAdmin(req.email(), req.password()).id();
        return get(UUID.fromString(createdId));
    }

    @Override
    public AdminPayload.Res get(UUID adminId) {
        AdminReaderDto.AdminView admin = adminReader.getAdminViewById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        return toResponse(admin);
    }

    @Override
    public PageResponse<AdminPayload.Res> getPage(int page, int size, String sortBy, String sortDirection,
                                                  String paramQuery) {
        AdminReaderDto.AdminPage result = adminReader.getPage(page, size, sortBy, sortDirection, paramQuery);
        return PageResponse.of(
                result.content().stream().map(this::toResponse).toList(),
                result.totalElements(),
                result.page(),
                result.size()
        );
    }



    @Override
    public AdminPayload.Res update(UUID adminId, AdminPayload.UpdateCommandReq req) {
        adminProcessor.updateAdmin(adminId, req.email(), req.password(), req.status(), req.enabled(), req.roleIds());
        return get(adminId);
    }

    @Override
    public AdminPayload.DeleteRes delete(UUID adminId) {
        adminProcessor.deleteAdmin(adminId);
        return new AdminPayload.DeleteRes(adminId.toString(), true, "사용자가 삭제되었습니다.");
    }

    private AdminPayload.Res toResponse(AdminReaderDto.AdminView admin) {
        return new AdminPayload.Res(
                admin.id().toString(),
                admin.email(),
                admin.status().name(),
                admin.enabled(),
                admin.roleIds().stream().map(UUID::toString).collect(java.util.stream.Collectors.toSet()),
                admin.roleNames(),
                admin.createdAt(),
                admin.updatedAt()
        );
    }
}
