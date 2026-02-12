package com.revy.domain.admin;

import com.revy.domain.admin.enums.AdminStatus;
import com.revy.domain.base.BaseEntity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import lombok.ToString;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Admin extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String email;

    @ToString.Exclude
    @Column(nullable = false)
    private String password;

    @Column(name="last_login_at")
    private LocalDateTime lastLoginAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdminStatus status = AdminStatus.ACTIVE;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "admin_permissions", joinColumns = @JoinColumn(name = "admin_id"))
    @Column(name = "permission")
    private Set<String> permissions = new HashSet<>();

    public void addPermission(String permission) {
        permissions.add(permission);
    }

    public void withdraw(){
        Assert.isTrue(this.status == AdminStatus.ACTIVE, "ACTIVE 상태여야 합니다.");
        this.status =  AdminStatus.WITHDRAWN;
    }

    public void login(){
        this.lastLoginAt = LocalDateTime.now();
    }
}
