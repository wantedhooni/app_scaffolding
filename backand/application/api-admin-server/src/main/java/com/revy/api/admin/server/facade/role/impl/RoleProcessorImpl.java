package com.revy.api.admin.server.facade.role.impl;

import com.revy.api.admin.server.facade.role.RoleProcessor;
import com.revy.api.admin.server.facade.role.RoleReader;
import com.revy.domain.admin.Admin;
import com.revy.domain.admin.Role;
import com.revy.domain.admin.repository.AdminRepository;
import com.revy.domain.admin.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleProcessorImpl implements RoleProcessor {
    private final RoleRepository roleRepository;
    private final AdminRepository adminRepository;
    private final RoleReader roleReader;

    @Override
    @Transactional
    public UUID createRole(String name, String description) {
        if (roleReader.existsByName(name)) {
            throw new IllegalArgumentException("이미 사용 중인 역할명입니다.");
        }
        Role role = Role.create(name, description);
        roleRepository.save(role);
        return role.getId();
    }

    @Override
    @Transactional
    public void updateRole(UUID roleId, String name, String description) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 역할입니다."));

        if (name != null && !name.isBlank() && !name.equals(role.getName())) {
            if (roleReader.existsByName(name)) {
                throw new IllegalArgumentException("이미 사용 중인 역할명입니다.");
            }
            role.changeName(name);
        }
        if (description != null) {
            role.changeDescription(description);
        }
        roleRepository.save(role);
    }

    @Override
    @Transactional
    public void deleteRole(UUID roleId) {
        if (roleRepository.findById(roleId).isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 역할입니다.");
        }
        roleRepository.deleteById(roleId);
    }

    @Override
    @Transactional
    public void addAdminToRole(UUID roleId, UUID adminId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 역할입니다."));
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        admin.addRole(role);
        adminRepository.save(admin);
    }
}
