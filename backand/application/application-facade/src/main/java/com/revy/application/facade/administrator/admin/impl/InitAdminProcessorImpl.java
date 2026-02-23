package com.revy.application.facade.administrator.admin.impl;


import com.revy.application.facade.administrator.admin.InitAdminProcessor;
import com.revy.domain.admin.Admin;
import com.revy.domain.admin.AdminPermission;
import com.revy.domain.admin.AdminRole;
import com.revy.common.domain.enums.admin.AdminStatus;
import com.revy.domain.admin.repository.AdminRepository;
import com.revy.domain.admin.repository.PermissionRepository;
import com.revy.domain.admin.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class InitAdminProcessorImpl implements InitAdminProcessor {
    private static final String DEFAULT_ADMIN_ROLE_NAME = "ROLE_ADMIN";
    private static final List<String> DEFAULT_PERMISSION_CODES = List.of(
            "ADMIN:READ",
            "ADMIN:WRITE",
            "ADMIN:DELETE"
    );

    private final AdminRepository adminRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin.email:sysadmin@system.dev}")
    private String bootstrapAdminEmail;

    @Value("${app.bootstrap.admin.password:qwer1234!}")
    private String bootstrapAdminPassword;

    @Override
    @Transactional
    public void initializeSecurityData() {
        List<AdminPermission> permissions = permissionRepository.saveAll(
                DEFAULT_PERMISSION_CODES.stream().map(AdminPermission::new).toList()
        );

        AdminRole adminRole = new AdminRole(DEFAULT_ADMIN_ROLE_NAME);
        permissions.forEach(adminRole::addPermission);
        roleRepository.save(adminRole);

        Admin admin = Admin.create(
                bootstrapAdminEmail,
                passwordEncoder.encode(bootstrapAdminPassword),
                AdminStatus.ACTIVE,
                true
        );
        admin.addRole(adminRole);
        adminRepository.save(admin);

        log.warn("bootstrap admin created: email={}, role={}", bootstrapAdminEmail, DEFAULT_ADMIN_ROLE_NAME);
    }
}
