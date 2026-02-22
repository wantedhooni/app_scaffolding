"use client";

import { Button, Stack, TextField } from "@mui/material";
import React from "react";

type DomainListToolbarProps = {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onCreate: () => void;
  createLabel?: string;
  keywordPlaceholder?: string;
};

export const DomainListToolbar: React.FC<DomainListToolbarProps> = ({
  keyword,
  onKeywordChange,
  onSearch,
  onCreate,
  createLabel = "Create",
  keywordPlaceholder = "Keyword",
}) => {
  return (
    <Stack direction="row" spacing={1.5} mb={2} alignItems="center">
      <TextField
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSearch();
          }
        }}
        placeholder={keywordPlaceholder}
        size="small"
        fullWidth
      />
      <Button variant="outlined" onClick={onSearch}>
        Search
      </Button>
      <Button variant="contained" onClick={onCreate}>
        {createLabel}
      </Button>
    </Stack>
  );
};
