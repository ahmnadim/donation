"use client";

import { useMessage } from "@/app/providers/messageProvider";
import { queryKeys } from "@/lib/constants";
import {
  EditFilled,
  DeleteFilled,
  FolderViewOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Empty, Popconfirm, Spin, Table } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Donation } from "../../services/donation.service";
import ViewDonation from "./viewDonation";

export default function UserDonations() {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session, status }: any = useSession();
  const { error, success } = useMessage();

  const { data: donations, isLoading: loading }: any = useQuery({
    queryKey: [queryKeys.getAllDonations],
    queryFn: async () => {
      return await Donation.GetDonations({
        token: session?.user?.access_token,
      });
    },

    enabled: !!session?.user?.access_token,
  });

  const {
    mutate: deleteDonation,
    isPending: deletePending,
    isSuccess: deleteSuccess,
  } = useMutation({
    mutationFn: (values) =>
      Donation.DeleteDonation({
        id: values?.id,
        token: session?.user?.access_token,
      }),
    onError: (err) => {
      error("Something went wrong!");
    },
    onSuccess: (data) => {
      success("Successfully deleted.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.getAllDonations] });
    },
  });

  const handleDelete = (id) => {
    const item: any = { id };
    item["token"] = session?.user?.access_token;
    deleteDonation(item);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Program",
      dataIndex: "program.name",
      key: "name",
      render: (name, row) => {
        return <span>{row?.program?.name}</span>;
      },
    },

    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => setSelectedDonation(record)}
          >
            <FolderViewOutlined />
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => router.push(`/admin/donations/${record.id}`)}
          >
            <EditFilled style={{ color: "green" }} />
          </Button>
          <Popconfirm
            title="Delete the item"
            description="Are you sure you want to delete this item?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(record?.id)} // Call delete handler when confirmed
            okText="Yes"
            cancelText="No"
            okButtonProps={{ type: "default", style: { color: "red" } }}
          >
            <Button size="small" type="link">
              <DeleteFilled style={{ color: "red" }} />
            </Button>
          </Popconfirm>
        </>
      ),
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
          {donations?.length > 0 ? (
            <Table
              dataSource={donations}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          ) : (
            <Empty description="No donations found" className="my-8" />
          )}
        </Card>
        <ViewDonation
          selectedDonation={selectedDonation}
          setSelectedDonation={setSelectedDonation}
        />
      </div>
    </div>
  );
}
