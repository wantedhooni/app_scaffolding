"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Switch, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { createAdmin, deleteAdmin, getAdminPage, getRolePage, getUiMeta, updateAdmin, type UiMetaView } from "@/lib/api";
import { buildColumnsFromMeta } from "@/lib/ui-meta";

type Admin = {
  id: string;
  email: string;
  status: string;
  enabled: boolean;
  roleIds?: string[];
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
};

type Role = {
  id: string;
  name: string;
};

export default function AdminsPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Admin[]>([]);
  const [meta, setMeta] = useState<UiMetaView | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [roleOptions, setRoleOptions] = useState<Array<{ label: string; value: string }>>([]);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [filterForm] = Form.useForm();

  const toQueryString = (filters?: Record<string, unknown>) => {
    const params = new URLSearchParams({ page: "0", size: "50" });
    Object.entries(filters ?? {}).forEach(([key, raw]) => {
      if (raw === null || raw === undefined || raw === "") return;
      if (Array.isArray(raw)) {
        if (raw.length === 0) return;
        raw.forEach((value) => params.append(key, String(value)));
        return;
      }
      params.set(key, String(raw));
    });
    return params.toString();
  };

  const load = async (filters?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const path = meta?.resourcePath ?? "/api/admin/list";
      const query = Object.fromEntries(new URLSearchParams(toQueryString(filters)).entries());
      const baseRows = path.startsWith("/api/admin")
        ? (await getAdminPage<Admin>(query)).content ?? []
        : (await getAdminPage<Admin>({ page: 0, size: 50 })).content ?? [];
      const emailFilter = String(filters?.email ?? "").trim().toLowerCase();
      const statusFilter = String(filters?.status ?? "").trim();
      const enabledFilter = String(filters?.enabled ?? "").trim().toLowerCase();
      const filtered = baseRows.filter((row) => {
        const byEmail = !emailFilter || row.email.toLowerCase().includes(emailFilter);
        const byStatus = !statusFilter || row.status === statusFilter;
        const byEnabled = !enabledFilter || String(row.enabled) === enabledFilter;
        return byEmail && byStatus && byEnabled;
      });
      setRows(filtered);
    } catch (e) {
      message.error(e instanceof Error ? e.message : "목록 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  const loadMeta = async () => {
    try {
      setMeta(await getUiMeta("admins"));
    } catch (e) {
      message.error(e instanceof Error ? e.message : "UI 메타 조회 실패");
    }
  };

  const loadRoleOptions = async () => {
    try {
      const res = await getRolePage<Role>({ page: 0, size: 200 });
      setRoleOptions((res.content ?? []).map((role) => ({ label: role.name, value: role.id })));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadMeta();
    loadRoleOptions();
  }, []);

  useEffect(() => {
    load(filterForm.getFieldsValue());
  }, [meta]);

  const onCreate = async () => {
    const values = await createForm.validateFields();
    try {
      await createAdmin<Admin>(values);
      message.success("사용자를 생성했습니다.");
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
      await updateAdmin<Admin>({ adminId: editing.id, ...values });
      message.success("사용자 정보를 수정했습니다.");
      setEditing(null);
      await load(filterForm.getFieldsValue());
    } catch (e) {
      message.error(e instanceof Error ? e.message : "수정 실패");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteAdmin(id);
      message.success("사용자를 삭제했습니다.");
      await load(filterForm.getFieldsValue());
    } catch (e) {
      message.error(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  const fallbackColumns: UiMetaView["columns"] = [
    { key: "email", label: "Email", dataType: "string", sortable: true, visible: true, width: 260, order: 10 },
    { key: "status", label: "Status", dataType: "tag", sortable: true, visible: true, width: 120, order: 20 },
    { key: "enabled", label: "Enabled", dataType: "boolean", sortable: true, visible: true, width: 120, order: 30 },
    { key: "roles", label: "Roles", dataType: "tags", sortable: false, visible: true, width: 240, order: 40 },
  ];

  const columns = useMemo<ColumnsType<Admin>>(() => {
    const dynamicColumns = buildColumnsFromMeta<Admin>(meta?.columns ?? fallbackColumns);
    return [
      ...dynamicColumns,
      {
        title: "Actions",
        key: "actions",
        render: (_: unknown, row: Admin) => (
          <Space>
            <Button size="small" onClick={() => router.push(`/admins/${row.id}`)}>
              상세
            </Button>
            <Button
              size="small"
              onClick={() => {
                setEditing(row);
                editForm.setFieldsValue({
                  email: row.email,
                  password: "",
                  status: row.status,
                  enabled: row.enabled,
                  roleIds: row.roleIds ?? [],
                });
              }}
            >
              수정
            </Button>
            <Popconfirm title="사용자를 삭제할까요?" onConfirm={() => onDelete(row.id)}>
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
        title={meta?.title ?? "사용자 관리"}
        extra={
          <Button type="primary" onClick={() => setOpenCreate(true)}>
            사용자 생성
          </Button>
        }
      >
        <Typography.Paragraph type="secondary">DB의 UI 메타 정보로 컬럼/검색 필터를 동적으로 렌더링합니다.</Typography.Paragraph>

        <Form
          form={filterForm}
          layout="inline"
          onFinish={(values) => load(values)}
          style={{ marginBottom: 16, rowGap: 8 }}
        >
          {(meta?.filters ?? []).map((filter) => (
            <Form.Item key={filter.key} name={filter.key} label={filter.label}>
              {filter.componentType === "select" ? (
                <Select allowClear style={{ minWidth: 180 }} placeholder={filter.placeholder} options={filter.options} />
              ) : (
                <Input allowClear placeholder={filter.placeholder} />
              )}
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

      <Modal forceRender open={openCreate} title="사용자 생성" onCancel={() => setOpenCreate(false)} onOk={onCreate} okText="생성 실행">
        <Form form={createForm} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      <Modal forceRender open={!!editing} title="사용자 수정" onCancel={() => setEditing(null)} onOk={onUpdate} okText="수정 반영">
        <Form form={editForm} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input.Password placeholder="변경 시에만 입력" />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select
              options={[
                { label: "ACTIVE", value: "ACTIVE" },
                { label: "WITHDRAWN", value: "WITHDRAWN" },
              ]}
              allowClear
            />
          </Form.Item>
          <Form.Item name="enabled" label="Enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="roleIds" label="Roles">
            <Select mode="multiple" options={roleOptions} allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
