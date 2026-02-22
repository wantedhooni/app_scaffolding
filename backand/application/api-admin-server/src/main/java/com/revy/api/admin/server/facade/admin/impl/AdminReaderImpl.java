package com.revy.api.admin.server.facade.admin.impl;

import com.revy.api.admin.server.facade.admin.AdminReader;
import com.revy.api.admin.server.facade.admin.dto.AdminReaderDto;
import com.revy.domain.admin.Admin;
import com.revy.domain.admin.AdminRole;
import com.revy.domain.admin.QAdmin;
import com.revy.domain.admin.QAdminPermission;
import com.revy.domain.admin.QAdminRole;
import com.revy.domain.admin.enums.AdminStatus;
import com.revy.domain.admin.repository.AdminRepository;
import com.revy.domain.admin.repository.PermissionRepository;
import com.revy.domain.admin.repository.RoleRepository;
import com.querydsl.core.BooleanBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminReaderImpl implements AdminReader {
    private static final String DEFAULT_SORT_FIELD = "createdAt";
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "createdAt",
            "updatedAt",
            "email",
            "status"
    );

    private final AdminRepository adminRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public boolean hasAnySecurityData() {
        return adminRepository.exists(QAdmin.admin.id.isNotNull()) || roleRepository.exists(
                QAdminRole.adminRole.id.isNotNull()) || permissionRepository.exists(
                QAdminPermission.adminPermission.id.isNotNull());
    }

    @Override
    public boolean existsByEmail(String email) {
        return adminRepository.exists(QAdmin.admin.email.eq(email));
    }

    @Override
    public Optional<AdminReaderDto.RoleRef> getRoleByName(String roleName) {
        return roleRepository.findOne(QAdminRole.adminRole.name.eq(roleName))
                             .map(role -> new AdminReaderDto.RoleRef(role.getId(), role.getName()));
    }

    @Override
    public Optional<AdminReaderDto.AuthAdmin> getAuthAdminByEmail(String email) {
        return adminRepository.findOne(QAdmin.admin.email.eq(email)).map(this::toAuthAdmin);
    }

    @Override
    public Optional<AdminReaderDto.AuthAdmin> getAuthAdminById(UUID adminId) {
        return adminRepository.findOne(QAdmin.admin.id.eq(adminId)).map(this::toAuthAdmin);
    }

    @Override
    public Optional<AdminReaderDto.AdminView> getAdminViewById(UUID adminId) {
        return adminRepository.findOne(QAdmin.admin.id.eq(adminId)).map(this::toAdminView);
    }

    @Override
    public AdminReaderDto.AdminPage getPage(int page, int size, String sortBy, String sortDirection,
                                            String paramQuery) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);
        Sort sort = resolveSort(sortBy, sortDirection);
        BooleanBuilder predicate = buildSearchPredicate(paramQuery);

        PageRequest pageable = PageRequest.of(safePage, safeSize, sort);
        Page<Admin> result = adminRepository.findAll(predicate, pageable);
        return new AdminReaderDto.AdminPage(result.getContent().stream().map(this::toAdminView).toList(),
                                            result.getTotalElements(), safePage, safeSize);
    }


    private AdminReaderDto.AuthAdmin toAuthAdmin(Admin admin) {
        RoleSnapshot roleSnapshot = buildRoleSnapshot(admin);
        return new AdminReaderDto.AuthAdmin(admin.getId(), admin.getEmail(), admin.getPassword(), admin.getStatus(),
                                            admin.isEnabled(), roleSnapshot.roleNames());
    }

    private AdminReaderDto.AdminView toAdminView(Admin admin) {
        RoleSnapshot roleSnapshot = buildRoleSnapshot(admin);
        return new AdminReaderDto.AdminView(admin.getId(), admin.getEmail(), admin.getStatus(), admin.isEnabled(),
                                            roleSnapshot.roleIds(), roleSnapshot.roleNames(), admin.getCreatedAt(),
                                            admin.getUpdatedAt());
    }

    private BooleanBuilder buildSearchPredicate(String paramQuery) {
        BooleanBuilder predicate = new BooleanBuilder();

        if (!StringUtils.hasText(paramQuery)) {
            return predicate;
        }

        String[] tokens = paramQuery.split(":", 2);
        if (tokens.length != 2 || !StringUtils.hasText(tokens[0]) || !StringUtils.hasText(tokens[1])) {
            return predicate;
        }

        String field = tokens[0].trim();
        String value = tokens[1].trim();

        switch (field) {
            case "email" -> predicate.and(QAdmin.admin.email.containsIgnoreCase(value));
            case "status" -> {
                try {
                    predicate.and(QAdmin.admin.status.eq(AdminStatus.valueOf(value.toUpperCase())));
                } catch (IllegalArgumentException ignored) {
                    // invalid status filter is ignored intentionally
                }
            }
            case "enabled" -> {
                if ("true".equalsIgnoreCase(value) || "false".equalsIgnoreCase(value)) {
                    predicate.and(QAdmin.admin.enabled.eq(Boolean.parseBoolean(value)));
                }
            }
            default -> {
                // unsupported filter field is ignored intentionally
            }
        }

        return predicate;
    }

    private Sort resolveSort(String sortBy, String sortDirection) {
        String field = StringUtils.hasText(sortBy) && ALLOWED_SORT_FIELDS.contains(sortBy)
                ? sortBy
                : DEFAULT_SORT_FIELD;

        Sort.Direction direction;
        try {
            direction = Sort.Direction.fromString(sortDirection);
        } catch (Exception ignored) {
            direction = Sort.Direction.DESC;
        }

        return Sort.by(direction, field);
    }

    private RoleSnapshot buildRoleSnapshot(Admin admin) {
        Set<UUID> roleIds = new HashSet<>();
        Set<String> roleNames = new HashSet<>();

        for (AdminRole role : admin.getAdminRoles()) {
            roleIds.add(role.getId());
            roleNames.add(role.getName());
        }

        return new RoleSnapshot(roleIds, roleNames);
    }

    private record RoleSnapshot(Set<UUID> roleIds, Set<String> roleNames) {
    }
}
