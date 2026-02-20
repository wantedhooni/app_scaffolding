package com.revy.domain.ui;

import com.revy.domain.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ui_grid_field")
@Getter
@NoArgsConstructor
public class UiGridField extends BaseEntity {
    @Column(name = "view_key", nullable = false, length = 100)
    private String viewKey;

    @Column(name = "field_key", nullable = false, length = 100)
    private String fieldKey;

    @Column(name = "label", nullable = false, length = 120)
    private String label;

    @Column(name = "data_type", nullable = false, length = 40)
    private String dataType;

    @Column(name = "sortable", nullable = false)
    private boolean sortable;

    @Column(name = "visible", nullable = false)
    private boolean visible;

    @Column(name = "width")
    private Integer width;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;
}
