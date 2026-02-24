import type { GridColDef } from "@mui/x-data-grid";

// Resource name used by Refine hooks and API mapping (must match resources[].name).
export const RESOURCE = "users";
export const API_PATH = "/api/user";
export const RESOURCE_META = { apiPath: API_PATH } as const;

// Human-readable entity label for button/dialog text.
export const ENTITY_LABEL = "User";

// Main field key used in list column, form payload, and show value.
export const PRIMARY_FIELD = "id";

// UI label text displayed for PRIMARY_FIELD.
export const PRIMARY_LABEL = "ID";

type ActionRenderer = NonNullable<GridColDef["renderCell"]>;

export const createListColumns = (renderActions: ActionRenderer): GridColDef[] => [
  { field: "id", headerName: "ID", minWidth: 300, flex: 1 },
  { field: "email", headerName: "Email", minWidth: 180, flex: 1 },
  { field: "firstName", headerName: "First Name", minWidth: 180, flex: 1 },
  { field: "lastName", headerName: "Last Name", minWidth: 180, flex: 1 },
  { field: "nickName", headerName: "Nick Name", minWidth: 180, flex: 1 },
  { field: "status", headerName: "Status", minWidth: 180, flex: 1 },
  {
    field: "permissions",
    headerName: "Permissions",
    minWidth: 220,
    flex: 1,
    valueGetter: (_, row) => (Array.isArray(row?.permissions) ? row.permissions.join(", ") : "-"),
  },
  { field: "failCount", headerName: "Fail Count", minWidth: 120 },
  { field: "enabled", headerName: "Enabled", minWidth: 120 },
  {
    field: "actions",
    headerName: "Actions",
    align: "right",
    headerAlign: "right",
    minWidth: 140,
    sortable: false,
    renderCell: renderActions,
  },
];
