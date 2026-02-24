"use client";

import { Box, TextField } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { DESCRIPTION_FIELD, DESCRIPTION_LABEL, NAME_FIELD, NAME_LABEL, RESOURCE, RESOURCE_META } from "../../constants";

export default function RoleEditPage() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: RESOURCE,
      meta: RESOURCE_META,
    },
  });

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box component="form" sx={{ display: "flex", flexDirection: "column" }} autoComplete="off">
        <TextField
          {...register(NAME_FIELD)}
          error={!!(errors as any)?.[NAME_FIELD]}
          helperText={(errors as any)?.[NAME_FIELD]?.message}
          margin="normal"
          fullWidth
          label={NAME_LABEL}
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
    </Edit>
  );
}
