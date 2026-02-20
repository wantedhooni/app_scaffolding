"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Col, Empty, Row, Table, Tag, Typography } from "antd";
import { API_BASE_URL, getOpenApiDoc, type OpenApiDoc } from "@/lib/api";

type EndpointRow = {
  key: string;
  method: string;
  path: string;
  tag: string;
  summary: string;
};

export default function DashboardPage() {
  const [doc, setDoc] = useState<OpenApiDoc | null>(null);

  useEffect(() => {
    getOpenApiDoc()
      .then((json: OpenApiDoc) => setDoc(json))
      .catch(() => setDoc({}));
  }, []);

  const endpoints = useMemo<EndpointRow[]>(() => {
    if (!doc?.paths) return [];
    const rows: EndpointRow[] = [];
    Object.entries(doc.paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, op]) => {
        rows.push({
          key: `${method}:${path}`,
          method: method.toUpperCase(),
          path,
          tag: op.tags?.[0] ?? "미분류",
          summary: op.summary ?? "(summary 없음)",
        });
      });
    });
    return rows;
  }, [doc]);

  const tagCount = useMemo(() => {
    const map = new Map<string, number>();
    endpoints.forEach((e) => map.set(e.tag, (map.get(e.tag) ?? 0) + 1));
    return Array.from(map.entries()).map(([tag, count]) => ({ tag, count }));
  }, [endpoints]);

  return (
    <div>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        API 기반 대시보드
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        소스: <a href={`${API_BASE_URL}/v3/api-docs`} target="_blank">{API_BASE_URL}/v3/api-docs</a>
      </Typography.Paragraph>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {tagCount.length === 0 ? (
          <Col span={24}>
            <Card>
              <Empty description="Swagger 문서를 불러오지 못했습니다." />
            </Card>
          </Col>
        ) : (
          tagCount.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.tag}>
              <Card>
                <Typography.Text strong>{item.tag}</Typography.Text>
                <br />
                <Typography.Title level={3} style={{ margin: "8px 0 0" }}>
                  {item.count}
                </Typography.Title>
                <Typography.Text type="secondary">Endpoints</Typography.Text>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Card title="API 메뉴 맵">
        <Table
          size="small"
          dataSource={endpoints}
          pagination={{ pageSize: 10 }}
          columns={[
            {
              title: "METHOD",
              dataIndex: "method",
              width: 110,
              render: (method: string) => <Tag color={method === "GET" ? "blue" : "green"}>{method}</Tag>,
            },
            { title: "PATH", dataIndex: "path" },
            { title: "TAG", dataIndex: "tag", width: 220 },
            { title: "SUMMARY", dataIndex: "summary" },
          ]}
        />
      </Card>
    </div>
  );
}
