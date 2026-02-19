package com.revy.api.admin.server.facade.permission;

import com.revy.api.admin.server.facade.permission.dto.PermissionReaderDto;

import java.util.Optional;
import java.util.UUID;

public interface PermissionReader {
    boolean existsByCode(String code);

    Optional<PermissionReaderDto.PermissionView> getPermissionViewById(UUID permissionId);

    PermissionReaderDto.PermissionPage getPermissionViewPage(int page, int size);
}
