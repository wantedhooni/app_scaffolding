"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Typography, message } from "antd";
import { apiFetch } from "@/lib/api";

type Permission = {
  id: string;
  code: string;
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

export default function PermissionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Permission[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<Permission | null>(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<PageResponse<Permission>>("/api/permission?page=0&size=50", { method: "GET" });
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
      await apiFetch<Permission>("/api/permission/create", {
        method: "POST",
        body: JSON.stringify(values),
      });
      message.success("권한을 생성했습니다.");
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
      await apiFetch<Permission>("/api/permission/update", {
        method: "POST",
        body: JSON.stringify({ permissionId: editing.id, ...values }),
      });
      message.success("권한을 수정했습니다.");
      setEditing(null);
      await load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "수정 실패");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await apiFetch<{ id: string; deleted: boolean; message: string }>("/api/permission/delete", {
        method: "POST",
        body: JSON.stringify({ permissionId: id }),
      });
      message.success("권한을 삭제했습니다.");
      await load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  const columns = useMemo(
    () => [
      { title: "Code", dataIndex: "code" },
      { title: "Description", dataIndex: "description" },
      {
        title: "Actions",
        key: "actions",
        render: (_: unknown, row: Permission) => (
          <Space>
            <Button size="small" onClick={() => router.push(`/permissions/${row.id}`)}>상세</Button>
            <Button
              size="small"
              onClick={() => {
                setEditing(row);
                editForm.setFieldsValue({
                  code: row.code,
                  description: row.description,
                });
              }}
            >
              수정
            </Button>
            <Popconfirm title="권한을 삭제할까요?" onConfirm={() => onDelete(row.id)}>
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
        title="권한 관리"
        extra={
          <Button type="primary" onClick={() => setOpenCreate(true)}>
            권한 생성
          </Button>
        }
      >
        <Typography.Paragraph type="secondary">
          권한 생성/수정/삭제 커맨드를 실행하는 운영 화면입니다.
        </Typography.Paragraph>

        <Table rowKey="id" loading={loading} dataSource={rows} columns={columns} pagination={false} />
      </Card>

      <Modal open={openCreate} title="권한 생성" onCancel={() => setOpenCreate(false)} onOk={onCreate} okText="생성 실행">
        <Form form={createForm} layout="vertical">
          <Form.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal open={!!editing} title="권한 수정" onCancel={() => setEditing(null)} onOk={onUpdate} okText="수정 반영">
        <Form form={editForm} layout="vertical">
          <Form.Item name="code" label="Code">
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
