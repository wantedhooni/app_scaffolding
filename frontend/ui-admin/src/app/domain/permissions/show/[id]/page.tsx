"use client";

import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";

export default function PermissionShowPage() {
  const { query } = useShow({
    resource: "permissions",
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">ID</Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">Code</Typography>
        <TextField value={record?.code} />

        <Typography variant="body1" fontWeight="bold">Description</Typography>
        <TextField value={record?.description} />
      </Stack>
    </Show>
  );
}
