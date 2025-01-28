"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Layout, Menu, Spin } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Sider, Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status }: any = useSession();
  const router = useRouter();
  const [current, setCurrent] = useState("dashboard");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (session?.user?.role == "USER") {
    return <div>Access Denied</div>;
  }

  const items = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Dashboard</Link>,
    },
    {
      key: "donations",
      icon: <FileTextOutlined />,
      label: <Link href="/admin/donations">Donations</Link>,
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: <Link href="/admin/donors">Users</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" className="shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <div className="flex flex-col ">
          <Menu
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            activeKey="donations"
            items={items}
            selectedKeys={[current]}
            onClick={(e) => {
              setCurrent(e.key);
            }}
          />
          <Menu
            mode="inline"
            items={[
              {
                key: "signout",
                icon: <LogoutOutlined />,
                label: "Signout",
                onClick: () => {
                  signOut();
                  router.push("/auth/signin");
                },
              },
            ]}
          />
        </div>
      </Sider>
      <Layout>
        <Content className="p-6">{children}</Content>
      </Layout>
    </Layout>
  );
}
