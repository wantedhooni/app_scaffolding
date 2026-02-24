"use client";

import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { CODE_FIELD, CODE_LABEL, DESCRIPTION_FIELD, DESCRIPTION_LABEL, RESOURCE, RESOURCE_META } from "../../constants";

export default function PermissionShowPage() {
  const { query } = useShow({
    resource: RESOURCE,
    meta: RESOURCE_META,
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">ID</Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">{CODE_LABEL}</Typography>
        <TextField value={record?.[CODE_FIELD]} />

        <Typography variant="body1" fontWeight="bold">{DESCRIPTION_LABEL}</Typography>
        <TextField value={record?.[DESCRIPTION_FIELD]} />
      </Stack>
    </Show>
  );
}
