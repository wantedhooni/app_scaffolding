package com.revy.domain.ui;

import com.revy.domain.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ui_filter_field")
@Getter
@NoArgsConstructor
public class UiFilterField extends BaseEntity {
    @Column(name = "view_key", nullable = false, length = 100)
    private String viewKey;

    @Column(name = "filter_key", nullable = false, length = 100)
    private String filterKey;

    @Column(name = "label", nullable = false, length = 120)
    private String label;

    @Column(name = "component_type", nullable = false, length = 40)
    private String componentType;

    @Column(name = "operator_type", nullable = false, length = 40)
    private String operatorType;

    @Column(name = "placeholder", length = 200)
    private String placeholder;

    @Column(name = "options_json", length = 2000)
    private String optionsJson;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;
}
