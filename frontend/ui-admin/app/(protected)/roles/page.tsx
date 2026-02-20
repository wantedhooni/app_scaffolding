"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Typography } from "antd";
import { apiFetch } from "@/lib/api";

type Role = {
  id: string;
  name: string;
  description?: string;
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

export default function RolesPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Role[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<PageResponse<Role>>("/api/role?page=0&size=50", { method: "GET" });
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
      await apiFetch<Role>("/api/role/create", {
        method: "POST",
        body: JSON.stringify(values),
      });
      message.success("역할을 생성했습니다.");
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
      await apiFetch<Role>("/api/role/update", {
        method: "POST",
        body: JSON.stringify({ roleId: editing.id, ...values }),
      });
      message.success("역할을 수정했습니다.");
      setEditing(null);
      await load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "수정 실패");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await apiFetch<{ id: string; deleted: boolean; message: string }>("/api/role/delete", {
        method: "POST",
        body: JSON.stringify({ roleId: id }),
      });
      message.success("역할을 삭제했습니다.");
      await load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  const columns = useMemo(
    () => [
      { title: "Name", dataIndex: "name" },
      { title: "Description", dataIndex: "description" },
      {
        title: "Actions",
        key: "actions",
        render: (_: unknown, row: Role) => (
          <Space>
            <Button size="small" onClick={() => router.push(`/roles/${row.id}`)}>상세</Button>
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
    ],
    [editForm, router],
  );

  return (
    <>
      <Card
        title="역할 관리"
        extra={
          <Button type="primary" onClick={() => setOpenCreate(true)}>
            역할 생성
          </Button>
        }
      >
        <Typography.Paragraph type="secondary">
          역할 생성/수정/삭제 커맨드를 실행하는 운영 화면입니다.
        </Typography.Paragraph>

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
