"use client";

import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import { useModalForm } from "@refinedev/react-hook-form";
import React from "react";

import { DomainListToolbar } from "@components/domain-list-toolbar";
import {
  EMAIL_FIELD,
  EMAIL_LABEL,
  ENTITY_LABEL,
  PASSWORD_FIELD,
  PASSWORD_LABEL,
  RESOURCE,
  RESOURCE_META,
  createListColumns,
} from "./constants";

export default function AdminListPage() {
  const [keyword, setKeyword] = React.useState("");

  const { dataGridProps, setFilters, filters, tableQuery } = useDataGrid({
    resource: RESOURCE,
    meta: RESOURCE_META,
  });

  const {
    modal,
    register,
    handleSubmit,
    formState: { errors },
    refineCore: { formLoading },
  } = useModalForm({
    refineCoreProps: {
      resource: RESOURCE,
      meta: RESOURCE_META,
      action: "create",
    },
  });

  const handleSearch = React.useCallback(() => {
    const value = keyword.trim();
    const nextFilters = value
      ? [
          {
            field: "keyword",
            operator: "contains" as const,
            value,
          },
          {
            field: EMAIL_FIELD,
            operator: "contains" as const,
            value,
          },
        ]
      : [];

    if (JSON.stringify(filters) === JSON.stringify(nextFilters)) {
      tableQuery.refetch();
      return;
    }

    setFilters(nextFilters, "replace");
  }, [filters, keyword, setFilters, tableQuery]);

  const columns = React.useMemo(
    () =>
      createListColumns(
        ({ value }) =>
          value ? <Chip color="success" label="Y" size="small" /> : <Chip color="default" label="N" size="small" />,
        ({ row }) => (
          <>
            <EditButton hideText recordItemId={row.id} />
            <ShowButton hideText recordItemId={row.id} />
            <DeleteButton hideText recordItemId={row.id} />
          </>
        ),
      ),
    [],
  );

  return (
    <List headerButtons={() => null}>
      <DomainListToolbar
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={handleSearch}
        onCreate={modal.show}
      />
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
      <Dialog open={modal.visible} onClose={modal.close} fullWidth maxWidth="sm">
        <DialogTitle>{`Create ${ENTITY_LABEL}`}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            id="create-entity-form"
            onSubmit={handleSubmit(modal.submit)}
            sx={{ mt: 1, display: "flex", flexDirection: "column" }}
            autoComplete="off"
          >
            <TextField
              {...register(EMAIL_FIELD, { required: `${EMAIL_FIELD} is required` })}
              error={!!(errors as any)?.[EMAIL_FIELD]}
              helperText={(errors as any)?.[EMAIL_FIELD]?.message}
              margin="normal"
              fullWidth
              label={EMAIL_LABEL}
              type="email"
            />
            <TextField
              {...register(PASSWORD_FIELD, { required: `${PASSWORD_FIELD} is required` })}
              error={!!(errors as any)?.[PASSWORD_FIELD]}
              helperText={(errors as any)?.[PASSWORD_FIELD]?.message}
              margin="normal"
              fullWidth
              label={PASSWORD_LABEL}
              type="password"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={modal.close}>Cancel</Button>
          <Button type="submit" form="create-entity-form" variant="contained" disabled={formLoading}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </List>
  );
}
