"use client";

import { FileTextOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Menu, Spin } from "antd";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const { Sider, Content } = Layout;

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status }: any = useSession();
  const router = useRouter();

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

  if (session?.user?.role == "ADMIN") {
    return <div>Access Denied</div>;
  }

  const menuItems = [
    {
      key: "donations",
      icon: <FileTextOutlined />,
      label: <Link href="/donations">Donations</Link>,
    },
    {
      key: "signout",
      icon: <LogoutOutlined />,
      label: "Signout",
      onClick: () => {
        signOut();
        router.push("/auth/signin");
      },
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" className="shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold">User Panel</h1>
        </div>
        <div className="flex flex-col ">
          <Menu
            mode="inline"
            defaultSelectedKeys={["donations"]}
            items={menuItems}
          />
        </div>
      </Sider>
      <Layout>
        <Content className="p-6">{children}</Content>
      </Layout>
    </Layout>
  );
}
