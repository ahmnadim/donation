"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Spin } from "antd";
import { DollarOutlined, UserOutlined, RiseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Donor } from "../services/donor.service";
import { useSession } from "next-auth/react";
import { queryKeys } from "@/lib/constants";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDonors: 0,
    averageDonation: 0,
  });

  const { data: session, status }: any = useSession();

  const [recentDonations, setRecentDonations] = useState([]);

  const {
    data: dashboard,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: [queryKeys.getDashboardStats],
    queryFn: () =>
      Donor.GetDashboardStats({ token: session?.user?.access_token }),
  });

  const columns = [
    {
      title: "Donor",
      dataIndex: "donorName",
      key: "donorName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Purpose",
      dataIndex: "programName",
      key: "programName",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Donations"
              value={dashboard?.totalDonations}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Donors"
              value={dashboard?.totalDonors}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Average Donation"
              value={dashboard?.avgDonation}
              prefix={<RiseOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Donations">
        <Table
          dataSource={dashboard?.recentDonations}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}
