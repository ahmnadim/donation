"use client";

import { Donor } from "@/app/services/donor.service";
import { queryKeys } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Empty, Spin, Table } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Users() {
  const router = useRouter();
  const { data: session, status }: any = useSession();

  const { data: donors, isLoading: loading }: any = useQuery({
    queryKey: [queryKeys.getAllDonors],
    queryFn: async () => {
      return await Donor.GetAllDonors({
        token: session?.user?.access_token,
      });
    },

    enabled: !!session?.user?.access_token,
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  useEffect(() => {
    if (status !== "authenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex ">
      <div className="max-w-full w-full bg-white shadow-md rounded-lg p-6">
        <Card
          title="My Donations"
          className="shadow-lg min-h-full"
          extra={<Button onClick={() => router.push("/donate")}>Donate</Button>}
        >
          {donors?.length > 0 ? (
            <Table
              dataSource={donors}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          ) : (
            <Empty description="No donations found" className="my-8" />
          )}
        </Card>
      </div>
    </div>
  );
}
