"use client";

import { Box, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { PRIMARY_FIELD, PRIMARY_LABEL, RESOURCE, RESOURCE_META } from "../constants";

export default function DummyCreateTemplatePage() {
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
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box component="form" sx={{ display: "flex", flexDirection: "column" }} autoComplete="off">
        <TextField
          {...register(PRIMARY_FIELD, { required: `${PRIMARY_FIELD} is required` })}
          error={!!(errors as any)?.[PRIMARY_FIELD]}
          helperText={(errors as any)?.[PRIMARY_FIELD]?.message}
          margin="normal"
          fullWidth
          label={PRIMARY_LABEL}
        />
      </Box>
    </Create>
  );
}
