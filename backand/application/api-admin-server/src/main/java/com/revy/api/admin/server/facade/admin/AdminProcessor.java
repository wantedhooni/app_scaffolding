package com.revy.api.admin.server.facade.admin;

import com.revy.api.admin.server.facade.admin.dto.CreateAdminDto;
import com.revy.api.admin.server.facade.admin.dto.AdminTokenDto;
import com.revy.domain.admin.enums.UserStatus;

import java.util.List;
import java.util.UUID;

public interface AdminProcessor {
    CreateAdminDto.Result createAdmin(String email, String rawPassword);

    AdminTokenDto.Result login(String email, String rawPassword);

    AdminTokenDto.Result reissue(String refreshToken);

    void updateAdmin(UUID adminId, String email, String rawPassword, UserStatus status, Boolean enabled, List<String> roleIds);

    void deleteAdmin(UUID adminId);
}
