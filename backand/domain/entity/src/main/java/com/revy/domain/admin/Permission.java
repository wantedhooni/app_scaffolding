package com.revy.domain.admin;

import com.revy.domain.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "permission")
@Getter
@NoArgsConstructor
public class Permission extends BaseEntity {
    @Column(nullable = false, length = 80)
    private String code;

    @Column(length = 200)
    private String description;

    @ManyToMany(mappedBy = "permissions", fetch = FetchType.LAZY)
    private Set<Role> roles = new HashSet<>();

    public Permission(String code) {
        this.code = code;
    }

    public static Permission create(String code, String description) {
        Permission permission = new Permission(code);
        permission.description = description;
        return permission;
    }

    public void changeCode(String code) {
        this.code = code;
    }

    public void changeDescription(String description) {
        this.description = description;
    }
}
