"use client";

import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";

export default function RoleShowPage() {
  const { query } = useShow({
    resource: "roles",
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">ID</Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">Name</Typography>
        <TextField value={record?.name} />

        <Typography variant="body1" fontWeight="bold">Description</Typography>
        <TextField value={record?.description} />

        <Typography variant="body1" fontWeight="bold">Admins</Typography>
        <TextField
          value={
            Array.isArray(record?.admins)
              ? record.admins.map((admin: any) => admin.email).join(", ")
              : "-"
          }
        />
      </Stack>
    </Show>
  );
}
