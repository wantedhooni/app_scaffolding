"use client";

import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { DESCRIPTION_FIELD, DESCRIPTION_LABEL, NAME_FIELD, NAME_LABEL, RESOURCE, RESOURCE_META } from "../../constants";

export default function RoleShowPage() {
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

        <Typography variant="body1" fontWeight="bold">{NAME_LABEL}</Typography>
        <TextField value={record?.[NAME_FIELD]} />

        <Typography variant="body1" fontWeight="bold">{DESCRIPTION_LABEL}</Typography>
        <TextField value={record?.[DESCRIPTION_FIELD]} />

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
