import type { GridColDef } from "@mui/x-data-grid";

export const RESOURCE = "permissions";
export const ENTITY_LABEL = "Permission";
export const CODE_FIELD = "code";
export const CODE_LABEL = "Code";
export const DESCRIPTION_FIELD = "description";
export const DESCRIPTION_LABEL = "Description";

type ActionRenderer = NonNullable<GridColDef["renderCell"]>;

export const createListColumns = (renderActions: ActionRenderer): GridColDef[] => [
  { field: "id", headerName: "ID", minWidth: 260, flex: 1 },
  { field: CODE_FIELD, headerName: CODE_LABEL, minWidth: 200, flex: 1 },
  { field: DESCRIPTION_FIELD, headerName: DESCRIPTION_LABEL, minWidth: 260, flex: 1 },
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
