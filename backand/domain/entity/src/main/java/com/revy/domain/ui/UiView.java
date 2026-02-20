package com.revy.domain.ui;

import com.revy.domain.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ui_view")
@Getter
@NoArgsConstructor
public class UiView extends BaseEntity {
    @Column(name = "view_key", nullable = false, unique = true, length = 100)
    private String viewKey;

    @Column(name = "title", nullable = false, length = 120)
    private String title;

    @Column(name = "resource_path", nullable = false, length = 120)
    private String resourcePath;
}
