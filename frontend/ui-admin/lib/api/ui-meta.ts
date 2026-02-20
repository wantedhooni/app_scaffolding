import { apiFetch } from "./core";

export type UiMetaOption = {
  label: string;
  value: string;
};

export type UiMetaFilter = {
  key: string;
  label: string;
  componentType: "text" | "select" | string;
  operatorType: string;
  placeholder?: string;
  options: UiMetaOption[];
  order: number;
};

export type UiMetaColumn = {
  key: string;
  label: string;
  dataType: "string" | "boolean" | "tag" | "tags" | "datetime" | string;
  sortable: boolean;
  visible: boolean;
  width?: number;
  order: number;
};

export type UiMetaView = {
  viewKey: string;
  title: string;
  resourcePath: string;
  updatedAt?: string;
  columns: UiMetaColumn[];
  filters: UiMetaFilter[];
};

export async function getUiMeta(viewKey: string): Promise<UiMetaView> {
  const res = await apiFetch<UiMetaView>(`/api/ui/meta/${viewKey}`, { method: "GET" });
  return res.data;
}
