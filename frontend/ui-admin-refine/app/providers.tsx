"use client";

import { Refine } from "@refinedev/core";
import { RefineThemes } from "@refinedev/antd";
import { DashboardOutlined, SafetyCertificateOutlined, TeamOutlined, TagsOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, App as AntdApp } from "antd";
import { authProvider } from "@/lib/auth-provider";
import { dataProvider } from "@/lib/data-provider";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            authProvider={authProvider}
            dataProvider={dataProvider}
            resources={[
              { name: "login", list: "/login", meta: { hide: true } },
              { name: "dashboard", list: "/dashboard", meta: { label: "대시보드", icon: <DashboardOutlined /> } },
              { name: "admins", list: "/admins", meta: { label: "사용자", icon: <TeamOutlined /> } },
              { name: "roles", list: "/roles", meta: { label: "역할", icon: <TagsOutlined /> } },
              { name: "permissions", list: "/permissions", meta: { label: "권한", icon: <SafetyCertificateOutlined /> } },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              disableTelemetry: true,
            }}
          >
            {children}
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
