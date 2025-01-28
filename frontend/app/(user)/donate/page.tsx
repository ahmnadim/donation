"use client";

import { queryKeys } from "@/lib/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Form, InputNumber, message, Select } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Donation } from "../../services/donation.service";
import { Program } from "../../services/program.service";

const { Option } = Select;

export default function DonatePage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const { data: session, status }: any = useSession();

  const { data: programs, isLoading: programLoading } = useQuery({
    queryKey: [queryKeys.getAllPrograms],
    queryFn: () =>
      Program.GetAllProgram({ token: session?.user?.access_token }),
    select: (p) => {
      return p;
    },
  });

  const {
    mutate: createDonation,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: (data) => {
      return Donation.MakeDonation({
        data,
        token: session?.user?.access_token,
      });
    },
    onError: (err) => {
      message.error("Failed to submit donation. Please try again.");
    },
    onSuccess: (res) => {
      form.resetFields();
      message.success("Donation submitted successfully!");
    },
  });

  const onFinish = async (values: any) => {
    createDonation(values);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card
          title="Make a Donation"
          className="shadow-lg"
          extra={
            <Button onClick={() => router.push("/donations")}>
              My Donations
            </Button>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="amount"
              label="Donation Amount"
              rules={[
                { required: true, message: "Please enter donation amount" },
                {
                  type: "number",
                  min: 1,
                  message: "Amount must be greater than 0",
                },
              ]}
            >
              <InputNumber
                prefix="$"
                className="w-full"
                placeholder="Enter amount"
              />
            </Form.Item>

            <Form.Item
              name="currency"
              label="Currency"
              rules={[
                { required: true, message: "Please select currency type" },
              ]}
            >
              <Select placeholder="Select payment method">
                <Option value="bdt">BDT</Option>
                <Option value="usd">USD</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="programId"
              label="Donation Purpose"
              rules={[{ required: true, message: "Please select purpose" }]}
            >
              <Select
                placeholder="Select purpose"
                loading={programLoading}
                options={programs}
                fieldNames={{ label: "name", value: "id" }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                loading={isPending && !isSuccess}
                disabled={isPending && !isSuccess}
                className="w-full"
              >
                Submit Donation
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
