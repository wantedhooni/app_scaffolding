"use client";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
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
  CODE_FIELD,
  CODE_LABEL,
  DESCRIPTION_FIELD,
  DESCRIPTION_LABEL,
  ENTITY_LABEL,
  RESOURCE,
  createListColumns,
} from "./constants";

export default function PermissionListPage() {
  const [keyword, setKeyword] = React.useState("");

  const { dataGridProps, search } = useDataGrid({
    resource: RESOURCE,
    onSearch: ({ keyword: searchKeyword }: { keyword: string }) => {
      const value = searchKeyword.trim();

      if (!value) {
        return [];
      }

      return [
        {
          field: "keyword",
          operator: "contains",
          value,
        },
      ];
    },
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
      action: "create",
    },
  });

  const handleSearch = React.useCallback(() => {
    search({ keyword });
  }, [keyword, search]);

  const columns = React.useMemo(
    () =>
      createListColumns(({ row }) => (
        <>
          <EditButton hideText recordItemId={row.id} />
          <ShowButton hideText recordItemId={row.id} />
          <DeleteButton hideText recordItemId={row.id} />
        </>
      )),
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
            id="create-permission-form"
            onSubmit={handleSubmit(modal.submit)}
            sx={{ mt: 1, display: "flex", flexDirection: "column" }}
            autoComplete="off"
          >
            <TextField
              {...register(CODE_FIELD, { required: `${CODE_FIELD} is required` })}
              error={!!(errors as any)?.[CODE_FIELD]}
              helperText={(errors as any)?.[CODE_FIELD]?.message}
              margin="normal"
              fullWidth
              label={CODE_LABEL}
            />
            <TextField
              {...register(DESCRIPTION_FIELD)}
              error={!!(errors as any)?.[DESCRIPTION_FIELD]}
              helperText={(errors as any)?.[DESCRIPTION_FIELD]?.message}
              margin="normal"
              fullWidth
              multiline
              minRows={3}
              label={DESCRIPTION_LABEL}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={modal.close}>Cancel</Button>
          <Button type="submit" form="create-permission-form" variant="contained" disabled={formLoading}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </List>
  );
}
