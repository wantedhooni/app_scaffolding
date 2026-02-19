package com.revy.domain.admin;

import com.revy.domain.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "role")
@Getter
@NoArgsConstructor
public class Role extends BaseEntity {

    // 예: ROLE_ADMIN, ROLE_USER
    @Column(nullable = false, length = 60)
    private String name;

    @Column(length = 200)
    private String description;

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private Set<Admin> admins = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "role_permissions",
            joinColumns = @JoinColumn(name = "role_id", foreignKey = @ForeignKey(name = "fk_role_permissions_role")),
            inverseJoinColumns = @JoinColumn(name = "permission_id", foreignKey = @ForeignKey(name = "fk_role_permissions_permission")),
            uniqueConstraints = @UniqueConstraint(name = "uk_role_permissions", columnNames = {"role_id", "permission_id"})
    )
    private Set<Permission> permissions = new HashSet<>();

    public Role(String name) {
        this.name = name;
    }

    public static Role create(String name, String description) {
        Role role = new Role(name);
        role.description = description;
        return role;
    }

    public void changeName(String name) {
        this.name = name;
    }

    public void changeDescription(String description) {
        this.description = description;
    }

    // ---- convenience methods ----
    public void addPermission(Permission permission) {
        this.permissions.add(permission);
        permission.getRoles().add(this);
    }

    public void removePermission(Permission permission) {
        this.permissions.remove(permission);
        permission.getRoles().remove(this);
    }
}
