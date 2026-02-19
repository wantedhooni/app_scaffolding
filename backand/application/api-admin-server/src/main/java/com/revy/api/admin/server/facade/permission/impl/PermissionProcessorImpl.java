package com.revy.api.admin.server.facade.permission.impl;

import com.revy.api.admin.server.facade.permission.PermissionProcessor;
import com.revy.api.admin.server.facade.permission.PermissionReader;
import com.revy.domain.admin.Permission;
import com.revy.domain.admin.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PermissionProcessorImpl implements PermissionProcessor {
    private final PermissionRepository permissionRepository;
    private final PermissionReader permissionReader;

    @Override
    @Transactional
    public UUID createPermission(String code, String description) {
        if (permissionReader.existsByCode(code)) {
            throw new IllegalArgumentException("이미 사용 중인 권한 코드입니다.");
        }
        Permission permission = Permission.create(code, description);
        permissionRepository.save(permission);
        return permission.getId();
    }

    @Override
    @Transactional
    public void updatePermission(UUID permissionId, String code, String description) {
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 권한입니다."));

        if (code != null && !code.isBlank() && !code.equals(permission.getCode())) {
            if (permissionReader.existsByCode(code)) {
                throw new IllegalArgumentException("이미 사용 중인 권한 코드입니다.");
            }
            permission.changeCode(code);
        }
        if (description != null) {
            permission.changeDescription(description);
        }
        permissionRepository.save(permission);
    }

    @Override
    @Transactional
    public void deletePermission(UUID permissionId) {
        if (permissionRepository.findById(permissionId).isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 권한입니다.");
        }
        permissionRepository.deleteById(permissionId);
    }
}
