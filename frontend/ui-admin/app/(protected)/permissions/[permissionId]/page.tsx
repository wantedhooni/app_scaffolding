"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, App, Button, Card, Descriptions, Form, Input, Modal, Space, Spin, Typography } from "antd";
import { getPermission, updatePermission } from "@/lib/api";

type Permission = {
  id: string;
  code: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function PermissionDetailPage() {
  const params = useParams<{ permissionId: string }>();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Permission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const permission = await getPermission<Permission>(params.permissionId);
      setData(permission);
      form.setFieldsValue({
        code: permission.code,
        description: permission.description,
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
  }, [params.permissionId]);

  const onUpdate = async () => {
    const values = await form.validateFields();
    try {
      setSaving(true);
      await updatePermission<Permission>({ permissionId: params.permissionId, ...values });
      message.success("권한을 수정했습니다.");
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
      title="권한 상세"
      extra={
        <Space>
          <Button type="primary" onClick={() => setOpenEdit(true)}>
            수정
          </Button>
          <Button onClick={() => router.push("/permissions")}>목록</Button>
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
          <Descriptions.Item label="Code">{data.code}</Descriptions.Item>
          <Descriptions.Item label="Description">{data.description ?? "-"}</Descriptions.Item>
          <Descriptions.Item label="Created At">{data.createdAt ?? "-"}</Descriptions.Item>
          <Descriptions.Item label="Updated At">{data.updatedAt ?? "-"}</Descriptions.Item>
        </Descriptions>
      ) : (
        <Typography.Text type="secondary">데이터가 없습니다.</Typography.Text>
      )}

      <Modal
        forceRender
        open={openEdit}
        title="권한 수정"
        onCancel={() => setOpenEdit(false)}
        onOk={onUpdate}
        okText="수정 반영"
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Code">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
