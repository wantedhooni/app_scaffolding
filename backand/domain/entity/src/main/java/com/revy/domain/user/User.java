package com.revy.domain.user;

import com.revy.domain.base.BaseEntity;
import com.revy.domain.user.enums.UserStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity {
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "nick_name")
    private String nickName;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(name = "fail_count")
    private int failCount;

    @Column(name = "enabled")
    private boolean enabled;

    public void changeEmail(String email) {
        this.email = email;
    }

    public void changePassword(String password) {
        this.password = password;
    }

    public void changeEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void increaseFailCount() {
        this.failCount++;
    }

    public void resetFailCount() {
        this.failCount = 0;
    }

    @Builder
    private User(String email, String password, String firstName, String lastName, String nickName, UserStatus status,
                 int failCount, boolean enabled) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nickName = nickName;
        this.status = status;
        this.failCount = failCount;
        this.enabled = enabled;
    }

    public static User createUser(String email, String password, String firstName, String lastName, String nickName) {
        return User.builder()
                   .email(email)
                   .password(password)
                   .firstName(firstName)
                   .lastName(lastName)
                   .nickName(nickName)
                   .status(UserStatus.ACTIVE)
                   .failCount(0)
                   .enabled(true)
                   .build();
    }
}
