package com.revy.domain.user;

import com.revy.domain.admin.enums.AdminStatus;
import com.revy.domain.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")
@Getter
@NoArgsConstructor
public class User extends BaseEntity {
    @Column(name="email", unique = true, nullable = false)
    private String email;

    @Column(name="password", nullable = false)
    private String password;

    @Column(name="status", nullable = false)
    @Enumerated(EnumType.STRING)
    private AdminStatus status;

    @Column(name="enabled")
    private boolean enabled;

    public void changeEmail(String email) {
        this.email = email;
    }

    public void changePassword(String password) {
        this.password = password;
    }

    public void changeStatus(AdminStatus status) {
        this.status = status;
    }

    public void changeEnabled(boolean enabled) {
        this.enabled = enabled;
    }

}
