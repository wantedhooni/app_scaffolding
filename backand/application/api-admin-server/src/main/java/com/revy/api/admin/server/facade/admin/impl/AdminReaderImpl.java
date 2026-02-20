package com.revy.api.admin.server.facade.admin.impl;

import com.revy.api.admin.server.facade.admin.AdminReader;
import com.revy.api.admin.server.facade.admin.dto.AdminReaderDto;
import com.revy.domain.admin.Admin;
import com.revy.domain.admin.QAdmin;
import com.revy.domain.admin.QPermission;
import com.revy.domain.admin.QRole;
import com.revy.domain.admin.Role;
import com.revy.domain.admin.repository.AdminRepository;
import com.revy.domain.admin.repository.PermissionRepository;
import com.revy.domain.admin.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminReaderImpl implements AdminReader {
    private final AdminRepository adminRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public boolean hasAnySecurityData() {
        return adminRepository.exists(QAdmin.admin.id.isNotNull())
                || roleRepository.exists(QRole.role.id.isNotNull())
                || permissionRepository.exists(QPermission.permission.id.isNotNull());
    }

    @Override
    public boolean existsByEmail(String email) {
        return adminRepository.exists(QAdmin.admin.email.eq(email));
    }

    @Override
    public Optional<AdminReaderDto.RoleRef> getRoleByName(String roleName) {
        return roleRepository.findOne(QRole.role.name.eq(roleName))
                .map(role -> new AdminReaderDto.RoleRef(role.getId(), role.getName()));
    }

    @Override
    public Optional<AdminReaderDto.AuthAdmin> getAuthAdminByEmail(String email) {
        return adminRepository.findOne(QAdmin.admin.email.eq(email))
                .map(this::toAuthAdmin);
    }

    @Override
    public Optional<AdminReaderDto.AuthAdmin> getAuthAdminById(UUID adminId) {
        return adminRepository.findOne(QAdmin.admin.id.eq(adminId))
                .map(this::toAuthAdmin);
    }

    @Override
    public Optional<AdminReaderDto.AdminView> getAdminViewById(UUID adminId) {
        return adminRepository.findOne(QAdmin.admin.id.eq(adminId))
                .map(this::toAdminView);
    }

    @Override
    public AdminReaderDto.AdminPage getAdminViewPage(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);
        PageRequest pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Admin> result = adminRepository.findAll(QAdmin.admin.id.isNotNull(), pageable);
        return new AdminReaderDto.AdminPage(
                result.getContent().stream().map(this::toAdminView).toList(),
                result.getTotalElements(),
                safePage,
                safeSize
        );
    }

    private AdminReaderDto.AuthAdmin toAuthAdmin(Admin admin) {
        Set<String> roleNames = admin.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        return new AdminReaderDto.AuthAdmin(
                admin.getId(),
                admin.getEmail(),
                admin.getPassword(),
                admin.getStatus(),
                admin.isEnabled(),
                roleNames
        );
    }

    private AdminReaderDto.AdminView toAdminView(Admin admin) {
        Set<UUID> roleIds = admin.getRoles()
                .stream()
                .map(Role::getId)
                .collect(Collectors.toSet());
        Set<String> roleNames = admin.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        return new AdminReaderDto.AdminView(
                admin.getId(),
                admin.getEmail(),
                admin.getStatus(),
                admin.isEnabled(),
                roleIds,
                roleNames,
                admin.getCreatedAt(),
                admin.getUpdatedAt()
        );
    }
}
