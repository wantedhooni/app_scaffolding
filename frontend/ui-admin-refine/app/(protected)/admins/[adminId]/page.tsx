"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Button, Card, Descriptions, Form, Input, Modal, Select, Space, Spin, Switch, Tag, Typography, message } from "antd";
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

export default function AdminDetailPage() {
  const params = useParams<{ adminId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Admin | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<Admin>(`/api/admin/${params.adminId}`, { method: "GET" });
      setData(res.data);
      form.setFieldsValue({
        email: res.data.email,
        password: "",
        status: res.data.status,
        enabled: res.data.enabled,
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
  }, [params.adminId]);

  const onUpdate = async () => {
    const values = await form.validateFields();
    try {
      setSaving(true);
      await apiFetch<Admin>("/api/admin/update", {
        method: "POST",
        body: JSON.stringify({ adminId: params.adminId, ...values }),
      });
      message.success("사용자 정보를 수정했습니다.");
      setOpenEdit(false);
      await load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "수정 실패");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title="사용자 상세"
      extra={
        <Space>
          <Button type="primary" onClick={() => setOpenEdit(true)}>
            수정
          </Button>
          <Button onClick={() => router.push("/admins")}>목록</Button>
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
          <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={data.status === "ACTIVE" ? "green" : "default"}>{data.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Enabled">
            <Tag color={data.enabled ? "blue" : "red"}>{data.enabled ? "YES" : "NO"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Roles">
            <Space wrap>{data.roles?.map((r) => <Tag key={r}>{r}</Tag>)}</Space>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">{data.createdAt ?? "-"}</Descriptions.Item>
          <Descriptions.Item label="Updated At">{data.updatedAt ?? "-"}</Descriptions.Item>
        </Descriptions>
      ) : (
        <Typography.Text type="secondary">데이터가 없습니다.</Typography.Text>
      )}

      <Modal
        open={openEdit}
        title="사용자 수정"
        onCancel={() => setOpenEdit(false)}
        onOk={onUpdate}
        okText="수정 반영"
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical">
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
    </Card>
  );
}
