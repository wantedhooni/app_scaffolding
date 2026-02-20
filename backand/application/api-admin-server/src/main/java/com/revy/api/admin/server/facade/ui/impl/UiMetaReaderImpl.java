package com.revy.api.admin.server.facade.ui.impl;

import com.revy.api.admin.server.facade.ui.UiMetaReader;
import com.revy.api.admin.server.facade.ui.dto.UiMetaReaderDto;
import com.revy.domain.ui.QUiFilterField;
import com.revy.domain.ui.QUiGridField;
import com.revy.domain.ui.QUiView;
import com.revy.domain.ui.repository.UiFilterFieldRepository;
import com.revy.domain.ui.repository.UiGridFieldRepository;
import com.revy.domain.ui.repository.UiViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Component
@RequiredArgsConstructor
public class UiMetaReaderImpl implements UiMetaReader {
    private final UiViewRepository uiViewRepository;
    private final UiGridFieldRepository uiGridFieldRepository;
    private final UiFilterFieldRepository uiFilterFieldRepository;

    @Override
    public Optional<UiMetaReaderDto.UiViewView> getViewByKey(String viewKey) {
        return uiViewRepository.findOne(QUiView.uiView.viewKey.eq(viewKey))
                .map(view -> new UiMetaReaderDto.UiViewView(
                        view.getViewKey(),
                        view.getTitle(),
                        view.getResourcePath(),
                        view.getUpdatedAt()
                ));
    }

    @Override
    public List<UiMetaReaderDto.UiGridFieldView> getGridFields(String viewKey) {
        return StreamSupport.stream(uiGridFieldRepository.findAll(
                        QUiGridField.uiGridField.viewKey.eq(viewKey),
                        Sort.by(Sort.Direction.ASC, "displayOrder")
                ).spliterator(), false)
                .map(field -> new UiMetaReaderDto.UiGridFieldView(
                        field.getFieldKey(),
                        field.getLabel(),
                        field.getDataType(),
                        field.isSortable(),
                        field.isVisible(),
                        field.getWidth(),
                        field.getDisplayOrder()
                ))
                .toList();
    }

    @Override
    public List<UiMetaReaderDto.UiFilterFieldView> getFilterFields(String viewKey) {
        return StreamSupport.stream(uiFilterFieldRepository.findAll(
                        QUiFilterField.uiFilterField.viewKey.eq(viewKey),
                        Sort.by(Sort.Direction.ASC, "displayOrder")
                ).spliterator(), false)
                .map(field -> new UiMetaReaderDto.UiFilterFieldView(
                        field.getFilterKey(),
                        field.getLabel(),
                        field.getComponentType(),
                        field.getOperatorType(),
                        field.getPlaceholder(),
                        field.getOptionsJson(),
                        field.getDisplayOrder()
                ))
                .toList();
    }
}
