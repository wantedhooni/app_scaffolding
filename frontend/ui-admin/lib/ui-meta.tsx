import type { ColumnsType } from "antd/es/table";
import { Tag } from "antd";
import type { ReactNode } from "react";
import type { UiMetaColumn } from "@/lib/api";

function renderByType(value: unknown, dataType: string): ReactNode {
  if (dataType === "boolean") {
    const enabled = Boolean(value);
    return <Tag color={enabled ? "blue" : "red"}>{enabled ? "YES" : "NO"}</Tag>;
  }
  if (dataType === "tag") {
    return <Tag>{String(value ?? "")}</Tag>;
  }
  if (dataType === "tags") {
    const items = Array.isArray(value) ? value : [];
    return items.map((item) => <Tag key={String(item)}>{String(item)}</Tag>);
  }
  if (dataType === "datetime") {
    if (!value) return "-";
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString();
  }
  return String(value ?? "");
}

export function buildColumnsFromMeta<T extends Record<string, unknown>>(columns: UiMetaColumn[]): ColumnsType<T> {
  return columns
    .filter((column) => column.visible)
    .sort((a, b) => a.order - b.order)
    .map((column) => ({
      title: column.label,
      dataIndex: column.key,
      width: column.width,
      sorter: column.sortable,
      render: (value: unknown) => renderByType(value, column.dataType),
    }));
}
