"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, App, Button, Card, Descriptions, Form, Input, Modal, Select, Space, Spin, Table, Typography } from "antd";
import { apiFetch } from "@/lib/api";

type Role = {
  id: string;
  name: string;
  description?: string;
  admins?: { id: string; email: string }[];
  createdAt?: string;
  updatedAt?: string;
};

type Admin = {
  id: string;
  email: string;
};

type AdminPage = {
  content: Admin[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

export default function RoleDetailPage() {
  const params = useParams<{ roleId: string }>();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openAddAdmin, setOpenAddAdmin] = useState(false);
  const [adding, setAdding] = useState(false);
  const [adminOptions, setAdminOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<Role>(`/api/role/${params.roleId}`, { method: "GET" });
      setData(res.data);
      form.setFieldsValue({
        name: res.data.name,
        description: res.data.description,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "상세 조회 실패";
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [params.roleId]);

  const onUpdate = async () => {
    const values = await form.validateFields();
    try {
      setSaving(true);
      await apiFetch<Role>("/api/role/update", {
        method: "POST",
        body: JSON.stringify({ roleId: params.roleId, ...values }),
      });
      message.success("역할을 수정했습니다.");
      setOpenEdit(false);
      await load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "수정 실패");
    } finally {
      setSaving(false);
    }
  };

  const loadAdminOptions = async () => {
    try {
      const res = await apiFetch<AdminPage>("/api/admin?page=0&size=200", { method: "GET" });
      const assigned = new Set((data?.admins ?? []).map((a) => a.id));
      const options = (res.data.content ?? [])
        .filter((admin) => !assigned.has(admin.id))
        .map((admin) => ({ label: admin.email, value: admin.id }));
      setAdminOptions(options);
    } catch (e) {
      message.error(e instanceof Error ? e.message : "사용자 목록 조회 실패");
    }
  };

  const onAddAdmin = async () => {
    const values = await addForm.validateFields();
    try {
      setAdding(true);
      await apiFetch<Role>("/api/role/add-admin", {
        method: "POST",
        body: JSON.stringify({ roleId: params.roleId, adminId: values.adminId }),
      });
      message.success("역할에 사용자를 추가했습니다.");
      setOpenAddAdmin(false);
      addForm.resetFields();
      await load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "사용자 추가 실패");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card
      title="역할 상세"
      extra={
        <Space>
          <Button
            onClick={async () => {
              await loadAdminOptions();
              setOpenAddAdmin(true);
            }}
          >
            사용자 추가
          </Button>
          <Button type="primary" onClick={() => setOpenEdit(true)}>
            수정
          </Button>
          <Button onClick={() => router.push("/roles")}>목록</Button>
        </Space>
      }
    >
      {loading ? (
        <Spin />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : data ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{data.name}</Descriptions.Item>
          <Descriptions.Item label="Description">{data.description ?? "-"}</Descriptions.Item>
          <Descriptions.Item label="Assigned Users">
            <Table
              rowKey="id"
              size="small"
              pagination={false}
              dataSource={data.admins ?? []}
              columns={[
                { title: "ID", dataIndex: "id" },
                { title: "Email", dataIndex: "email" },
              ]}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Created At">{data.createdAt ?? "-"}</Descriptions.Item>
          <Descriptions.Item label="Updated At">{data.updatedAt ?? "-"}</Descriptions.Item>
        </Descriptions>
      ) : (
        <Typography.Text type="secondary">데이터가 없습니다.</Typography.Text>
      )}

      <Modal
        forceRender
        open={openEdit}
        title="역할 수정"
        onCancel={() => setOpenEdit(false)}
        onOk={onUpdate}
        okText="수정 반영"
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        forceRender
        open={openAddAdmin}
        title="사용자 추가"
        onCancel={() => setOpenAddAdmin(false)}
        onOk={onAddAdmin}
        okText="추가 실행"
        confirmLoading={adding}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item name="adminId" label="User" rules={[{ required: true }]}>
            <Select
              showSearch
              options={adminOptions}
              placeholder="추가할 사용자를 선택하세요"
              optionFilterProp="label"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
