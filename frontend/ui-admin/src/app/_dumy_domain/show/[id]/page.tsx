"use client";

import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { PRIMARY_FIELD, PRIMARY_LABEL, RESOURCE, RESOURCE_META } from "../../constants";

export default function DummyShowTemplatePage() {
  const { query } = useShow({
    resource: RESOURCE,
    meta: RESOURCE_META,
  });

  const { data, isLoading } = query;
  const record = data?.data as Record<string, any> | undefined;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">ID</Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">{PRIMARY_LABEL}</Typography>
        <TextField value={record?.[PRIMARY_FIELD]} />
      </Stack>
    </Show>
  );
}
