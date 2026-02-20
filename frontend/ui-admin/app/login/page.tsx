"use client";

import { useEffect, useState } from "react";
import { Button, Form, Input, Typography, Alert } from "antd";
import { useRouter } from "next/navigation";
import { loginAndStoreTokens, tokenStore } from "@/lib/api";

export default function LoginPage() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (tokenStore.getAccessToken()) router.replace("/dashboard");
  }, [router]);

  const onSubmit = async () => {
    const values = await form.validateFields();
    try {
      setSubmitting(true);
      setErrorMessage(null);
      await loginAndStoreTokens(values.email, values.password);
      router.replace("/dashboard");
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "로그인 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 8 }}>
          RBAC Admin Login
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 20 }}>
          관리자 인증 후 대시보드에 접근할 수 있습니다.
        </Typography.Paragraph>

        <Form
          form={form}
          layout="vertical"
          initialValues={{ email: "sysadmin@system.dev", password: "qwer1234!" }}
          onFinish={onSubmit}
        >
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password size="large" />
          </Form.Item>

          {errorMessage ? <Alert style={{ marginBottom: 12 }} type="error" message={errorMessage} /> : null}

          <Button size="large" htmlType="submit" type="primary" loading={submitting} block>
            로그인
          </Button>
        </Form>
      </section>
    </main>
  );
}
