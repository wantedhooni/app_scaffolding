package com.revy.api.admin.server.facade.administrator.admin;

import com.revy.api.admin.server.facade.administrator.admin.dto.CreateAdminDto;
import com.revy.api.admin.server.facade.administrator.admin.dto.AdminTokenDto;
import com.revy.domain.admin.enums.AdminStatus;

import java.util.List;
import java.util.UUID;

public interface AdminProcessor {
    CreateAdminDto.Result createAdmin(String email, String rawPassword);

    AdminTokenDto.Result login(String email, String rawPassword);

    AdminTokenDto.Result reissue(String refreshToken);

    void updateAdmin(UUID adminId, String email, String rawPassword, AdminStatus status, Boolean enabled, List<String> roleIds);

    void deleteAdmin(UUID adminId);
}
