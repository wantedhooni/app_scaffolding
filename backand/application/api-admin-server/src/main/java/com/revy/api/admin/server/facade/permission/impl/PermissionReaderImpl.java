package com.revy.api.admin.server.facade.permission.impl;

import com.revy.api.admin.server.facade.permission.PermissionReader;
import com.revy.api.admin.server.facade.permission.dto.PermissionReaderDto;
import com.revy.domain.admin.Permission;
import com.revy.domain.admin.QPermission;
import com.revy.domain.admin.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PermissionReaderImpl implements PermissionReader {
    private final PermissionRepository permissionRepository;

    @Override
    public boolean existsByCode(String code) {
        return permissionRepository.exists(QPermission.permission.code.eq(code));
    }

    @Override
    public Optional<PermissionReaderDto.PermissionView> getPermissionViewById(UUID permissionId) {
        return permissionRepository.findOne(QPermission.permission.id.eq(permissionId)).map(this::toView);
    }

    @Override
    public PermissionReaderDto.PermissionPage getPermissionViewPage(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);
        PageRequest pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Permission> result = permissionRepository.findAll(QPermission.permission.id.isNotNull(), pageable);
        return new PermissionReaderDto.PermissionPage(
                result.getContent().stream().map(this::toView).toList(),
                result.getTotalElements(),
                safePage,
                safeSize
        );
    }

    private PermissionReaderDto.PermissionView toView(Permission permission) {
        return new PermissionReaderDto.PermissionView(
                permission.getId(),
                permission.getCode(),
                permission.getDescription(),
                permission.getCreatedAt(),
                permission.getUpdatedAt()
        );
    }
}
