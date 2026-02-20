"use client";

import { useEffect } from "react";
import { Button, Layout, Menu, Space, Typography } from "antd";
import { DashboardOutlined, SafetyCertificateOutlined, TagsOutlined, TeamOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { tokenStore } from "@/lib/api";

const { Header, Sider, Content } = Layout;

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!tokenStore.getAccessToken()) {
      router.replace("/login");
    }
  }, [router]);

  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "대시보드" },
    { key: "/admins", icon: <TeamOutlined />, label: "사용자" },
    { key: "/roles", icon: <TagsOutlined />, label: "역할" },
    { key: "/permissions", icon: <SafetyCertificateOutlined />, label: "권한" },
  ];

  const selectedKey =
    menuItems.find((item) => pathname === item.key || pathname.startsWith(`${item.key}/`))?.key ?? "/dashboard";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240} style={{ background: "#ffffff", borderRight: "1px solid #f0f0f0" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", paddingInline: 16 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            RBAC Console
          </Typography.Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={(e) => router.push(e.key)}
          style={{ borderInlineEnd: "none" }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", paddingInline: 16 }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                tokenStore.clear();
                router.replace("/login");
              }}
            >
              로그아웃
            </Button>
          </Space>
        </Header>
        <Content style={{ padding: 16 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
