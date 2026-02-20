package com.revy.api.admin.server.facade.ui;

import com.revy.api.admin.server.facade.ui.dto.UiMetaReaderDto;

import java.util.List;
import java.util.Optional;

public interface UiMetaReader {
    Optional<UiMetaReaderDto.UiViewView> getViewByKey(String viewKey);

    List<UiMetaReaderDto.UiGridFieldView> getGridFields(String viewKey);

    List<UiMetaReaderDto.UiFilterFieldView> getFilterFields(String viewKey);
}
