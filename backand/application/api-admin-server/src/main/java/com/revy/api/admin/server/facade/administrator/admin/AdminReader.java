package com.revy.api.admin.server.facade.administrator.admin;

import com.revy.api.admin.server.facade.administrator.admin.dto.AdminReaderDto;

import java.util.Optional;
import java.util.UUID;

public interface AdminReader {
    boolean hasAnySecurityData();

    boolean existsByEmail(String email);

    Optional<AdminReaderDto.RoleRef> getRoleByName(String roleName);

    Optional<AdminReaderDto.AuthAdmin> getAuthAdminByEmail(String email);

    Optional<AdminReaderDto.AuthAdmin> getAuthAdminById(UUID adminId);

    Optional<AdminReaderDto.AdminView> getAdminViewById(UUID adminId);

    AdminReaderDto.AdminPage getPage(int page, int size, String sortBy, String sortDirection, String paramQuery);
}
