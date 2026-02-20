package com.revy.api.admin.server.facade.ui.dto;

import java.time.LocalDateTime;

public class UiMetaReaderDto {
    public record UiViewView(
            String viewKey,
            String title,
            String resourcePath,
            LocalDateTime updatedAt
    ) {
    }

    public record UiGridFieldView(
            String fieldKey,
            String label,
            String dataType,
            boolean sortable,
            boolean visible,
            Integer width,
            int displayOrder
    ) {
    }

    public record UiFilterFieldView(
            String filterKey,
            String label,
            String componentType,
            String operatorType,
            String placeholder,
            String optionsJson,
            int displayOrder
    ) {
    }
}
