// Resource name used by Refine hooks and API mapping (must match resources[].name).
export const RESOURCE = "dummy-resource";

// Human-readable entity label for button/dialog text.
export const ENTITY_LABEL = "Dummy";

// Main field key used in list column, form payload, and show value.
export const PRIMARY_FIELD = "name";

// UI label text displayed for PRIMARY_FIELD.
export const PRIMARY_LABEL = "Name";

// Placeholder text for the keyword search input.
export const SEARCH_PLACEHOLDER = "Search by keyword";

// Field list used to build contains filters from keyword input.
export const SEARCH_FIELDS = ["keyword"] as const;
