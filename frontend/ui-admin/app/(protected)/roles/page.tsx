"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { createRole, deleteRole, getRolePage, getUiMeta, updateRole, type UiMetaView } from "@/lib/api";
import { buildColumnsFromMeta } from "@/lib/ui-meta";

type Role = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function RolesPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Role[]>([]);
  const [meta, setMeta] = useState<UiMetaView | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [filterForm] = Form.useForm();

  const toQueryString = (filters?: Record<string, unknown>) => {
    const params = new URLSearchParams({ page: "0", size: "50" });
    Object.entries(filters ?? {}).forEach(([key, raw]) => {
      if (raw === null || raw === undefined || raw === "") return;
      params.set(key, String(raw));
    });
    return params.toString();
  };

  const load = async (filters?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const path = meta?.resourcePath ?? "/api/role/list";
      const query = Object.fromEntries(new URLSearchParams(toQueryString(filters)).entries());
      const baseRows = path.startsWith("/api/role")
        ? (await getRolePage<Role>(query)).content ?? []
        : (await getRolePage<Role>({ page: 0, size: 50 })).content ?? [];
      const nameFilter = String(filters?.name ?? "").trim().toLowerCase();
      setRows(baseRows.filter((row) => !nameFilter || row.name.toLowerCase().includes(nameFilter)));
    } catch (e) {
      message.error(e instanceof Error ? e.message : "목록 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  const loadMeta = async () => {
    try {
      setMeta(await getUiMeta("roles"));
    } catch (e) {
      message.error(e instanceof Error ? e.message : "UI 메타 조회 실패");
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  useEffect(() => {
    load(filterForm.getFieldsValue());
  }, [meta]);

  const onCreate = async () => {
    const values = await createForm.validateFields();
    try {
      await createRole<Role>(values);
      message.success("역할을 생성했습니다.");
      createForm.resetFields();
      setOpenCreate(false);
      await load(filterForm.getFieldsValue());
    } catch (e) {
      message.error(e instanceof Error ? e.message : "생성 실패");
    }
  };

  const onUpdate = async () => {
    if (!editing) return;
    const values = await editForm.validateFields();
    try {
      await updateRole<Role>({ roleId: editing.id, ...values });
      message.success("역할을 수정했습니다.");
      setEditing(null);
      await load(filterForm.getFieldsValue());
    } catch (e) {
      message.error(e instanceof Error ? e.message : "수정 실패");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteRole(id);
      message.success("역할을 삭제했습니다.");
      await load(filterForm.getFieldsValue());
    } catch (e) {
      message.error(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  const fallbackColumns: UiMetaView["columns"] = [
    { key: "name", label: "Name", dataType: "string", sortable: true, visible: true, width: 220, order: 10 },
    { key: "description", label: "Description", dataType: "string", sortable: false, visible: true, width: 300, order: 20 },
  ];

  const columns = useMemo<ColumnsType<Role>>(() => {
    const dynamicColumns = buildColumnsFromMeta<Role>(meta?.columns ?? fallbackColumns);
    return [
      ...dynamicColumns,
      {
        title: "Actions",
        key: "actions",
        render: (_: unknown, row: Role) => (
          <Space>
            <Button size="small" onClick={() => router.push(`/roles/${row.id}`)}>
              상세
            </Button>
            <Button
              size="small"
              onClick={() => {
                setEditing(row);
                editForm.setFieldsValue({
                  name: row.name,
                  description: row.description,
                });
              }}
            >
              수정
            </Button>
            <Popconfirm title="역할을 삭제할까요?" onConfirm={() => onDelete(row.id)}>
              <Button size="small" danger>
                삭제
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];
  }, [editForm, meta?.columns, router]);

  return (
    <>
      <Card
        title={meta?.title ?? "역할 관리"}
        extra={
          <Button type="primary" onClick={() => setOpenCreate(true)}>
            역할 생성
          </Button>
        }
      >
        <Typography.Paragraph type="secondary">DB 메타 기반 그리드/검색 필터 화면입니다.</Typography.Paragraph>

        <Form form={filterForm} layout="inline" onFinish={(values) => load(values)} style={{ marginBottom: 16, rowGap: 8 }}>
          {(meta?.filters ?? []).map((filter) => (
            <Form.Item key={filter.key} name={filter.key} label={filter.label}>
              <Input allowClear placeholder={filter.placeholder} />
            </Form.Item>
          ))}
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">
                검색
              </Button>
              <Button
                onClick={() => {
                  filterForm.resetFields();
                  load({});
                }}
              >
                초기화
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Table rowKey="id" loading={loading} dataSource={rows} columns={columns} pagination={false} />
      </Card>

      <Modal forceRender open={openCreate} title="역할 생성" onCancel={() => setOpenCreate(false)} onOk={onCreate} okText="생성 실행">
        <Form form={createForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal forceRender open={!!editing} title="역할 수정" onCancel={() => setEditing(null)} onOk={onUpdate} okText="수정 반영">
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
