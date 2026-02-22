"use client";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
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

export default function RoleListPage() {
  const [keyword, setKeyword] = React.useState("");

  const { dataGridProps, search } = useDataGrid({
    resource: "roles",
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
      resource: "roles",
      action: "create",
    },
  });

  const handleSearch = React.useCallback(() => {
    search({ keyword });
  }, [keyword, search]);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { field: "id", headerName: "ID", minWidth: 260, flex: 1 },
      { field: "name", headerName: "Name", minWidth: 180, flex: 1 },
      { field: "description", headerName: "Description", minWidth: 220, flex: 1 },
      {
        field: "admins",
        headerName: "Admins",
        minWidth: 120,
        valueGetter: (_, row) => (Array.isArray(row?.admins) ? row.admins.length : 0),
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "right",
        headerAlign: "right",
        minWidth: 140,
        sortable: false,
        renderCell: ({ row }) => (
          <>
            <EditButton hideText recordItemId={row.id} />
            <ShowButton hideText recordItemId={row.id} />
            <DeleteButton hideText recordItemId={row.id} />
          </>
        ),
      },
    ],
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
        <DialogTitle>Create Role</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            id="create-role-form"
            onSubmit={handleSubmit(modal.submit)}
            sx={{ mt: 1, display: "flex", flexDirection: "column" }}
            autoComplete="off"
          >
            <TextField
              {...register("name", { required: "name is required" })}
              error={!!(errors as any)?.name}
              helperText={(errors as any)?.name?.message}
              margin="normal"
              fullWidth
              label="Name"
            />
            <TextField
              {...register("description")}
              error={!!(errors as any)?.description}
              helperText={(errors as any)?.description?.message}
              margin="normal"
              fullWidth
              multiline
              minRows={3}
              label="Description"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={modal.close}>Cancel</Button>
          <Button type="submit" form="create-role-form" variant="contained" disabled={formLoading}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </List>
  );
}
