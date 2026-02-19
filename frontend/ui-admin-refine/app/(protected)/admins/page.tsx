"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message } from "antd";
import { apiFetch } from "@/lib/api";

type Admin = {
  id: string;
  email: string;
  status: string;
  enabled: boolean;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
};

type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

export default function AdminsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Admin[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<PageResponse<Admin>>("/api/admin?page=0&size=50", { method: "GET" });
      setRows(res.data.content ?? []);
    } catch (e) {
      message.error(e instanceof Error ? e.message : "목록 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async () => {
    const values = await createForm.validateFields();
    try {
      await apiFetch<Admin>("/api/admin/create", {
        method: "POST",
        body: JSON.stringify(values),
      });
      message.success("사용자를 생성했습니다.");
      createForm.resetFields();
      setOpenCreate(false);
      await load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "생성 실패");
    }
  };

  const onUpdate = async () => {
    if (!editing) return;
    const values = await editForm.validateFields();
    try {
      await apiFetch<Admin>("/api/admin/update", {
        method: "POST",
        body: JSON.stringify({ adminId: editing.id, ...values }),
      });
      message.success("사용자 정보를 수정했습니다.");
      setEditing(null);
      await load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "수정 실패");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await apiFetch<{ id: string; deleted: boolean; message: string }>("/api/admin/delete", {
        method: "POST",
        body: JSON.stringify({ adminId: id }),
      });
      message.success("사용자를 삭제했습니다.");
      await load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  const columns = useMemo(
    () => [
      { title: "Email", dataIndex: "email" },
      {
        title: "Status",
        dataIndex: "status",
        render: (v: string) => <Tag color={v === "ACTIVE" ? "green" : "default"}>{v}</Tag>,
      },
      {
        title: "Enabled",
        dataIndex: "enabled",
        render: (v: boolean) => <Tag color={v ? "blue" : "red"}>{v ? "YES" : "NO"}</Tag>,
      },
      {
        title: "Roles",
        dataIndex: "roles",
        render: (roles: string[]) => (
          <Space wrap>{(roles ?? []).map((r) => <Tag key={r}>{r}</Tag>)}</Space>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: unknown, row: Admin) => (
          <Space>
            <Button size="small" onClick={() => router.push(`/admins/${row.id}`)}>상세</Button>
            <Button
              size="small"
              onClick={() => {
                setEditing(row);
                editForm.setFieldsValue({
                  email: row.email,
                  password: "",
                  status: row.status,
                  enabled: row.enabled,
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
    ],
    [editForm, router],
  );

  return (
    <>
      <Card
        title="사용자 관리"
        extra={
          <Button type="primary" onClick={() => setOpenCreate(true)}>
            사용자 생성
          </Button>
        }
      >
        <Typography.Paragraph type="secondary">
          커맨드 패턴 API(`create/update/delete`)를 직접 사용하는 운영 화면입니다.
        </Typography.Paragraph>

        <Table rowKey="id" loading={loading} dataSource={rows} columns={columns} pagination={false} />
      </Card>

      <Modal open={openCreate} title="사용자 생성" onCancel={() => setOpenCreate(false)} onOk={onCreate} okText="생성 실행">
        <Form form={createForm} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      <Modal open={!!editing} title="사용자 수정" onCancel={() => setEditing(null)} onOk={onUpdate} okText="수정 반영">
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
        </Form>
      </Modal>
    </>
  );
}
