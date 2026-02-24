import type { GridColDef } from "@mui/x-data-grid";

export const RESOURCE = "roles";
export const ENTITY_LABEL = "Role";
export const NAME_FIELD = "name";
export const NAME_LABEL = "Name";
export const DESCRIPTION_FIELD = "description";
export const DESCRIPTION_LABEL = "Description";

type ActionRenderer = NonNullable<GridColDef["renderCell"]>;

export const createListColumns = (renderActions: ActionRenderer): GridColDef[] => [
  { field: "id", headerName: "ID", minWidth: 260, flex: 1 },
  { field: NAME_FIELD, headerName: NAME_LABEL, minWidth: 180, flex: 1 },
  { field: DESCRIPTION_FIELD, headerName: DESCRIPTION_LABEL, minWidth: 220, flex: 1 },
  {
    field: "admins",
    headerName: "Admins",
    minWidth: 120,
    valueGetter: (_, row) => (Array.isArray(row?.admins) ? row.admins.length : 0),
  },
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
