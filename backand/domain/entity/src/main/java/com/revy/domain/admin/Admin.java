package com.revy.domain.admin;

import com.revy.domain.base.BaseEntity;
import com.revy.domain.admin.enums.UserStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "admin")
@Getter
@NoArgsConstructor
public class Admin extends BaseEntity {
    @Column(name="email", unique = true, nullable = false)
    private String email;

    @Column(name="password", nullable = false)
    private String password;

    @Column(name="status", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(name="enabled")
    private boolean enabled;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "admin_roles",
            joinColumns = @JoinColumn(name = "admin_id", foreignKey = @ForeignKey(name = "fk_admin_roles_user")),
            inverseJoinColumns = @JoinColumn(name = "role_id", foreignKey = @ForeignKey(name = "fk_admin_roles_role")),
            uniqueConstraints = @UniqueConstraint(name = "uk_user_roles", columnNames = {"admin_id", "role_id"})
    )
    private Set<Role> roles = new HashSet<>();


    // ---- convenience methods ----
    public void addRole(Role role) {
        this.roles.add(role);
    }

    public void removeRole(Role role) {
        this.roles.remove(role);
    }
}
