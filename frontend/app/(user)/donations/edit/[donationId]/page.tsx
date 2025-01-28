"use client";

import { useMessage } from "@/app/providers/messageProvider";
import { Donation } from "@/app/services/donation.service";
import { Program } from "@/app/services/program.service";
import { queryKeys } from "@/lib/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Form, InputNumber, message, Select, Spin } from "antd";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const { Option } = Select;

export default function EditDonation() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { success, error } = useMessage();

  const { data: session, status }: any = useSession();
  const { donationId }: any = useParams();

  const { data: programs, isLoading: programLoading } = useQuery({
    queryKey: [queryKeys.getAllPrograms],
    queryFn: () =>
      Program.GetAllProgram({ token: session?.user?.access_token }),
    enabled: !!session?.user?.access_token,
  });

  const { data: donation, isLoading: donationLoading } = useQuery({
    queryKey: [queryKeys.getDonation, donationId],
    queryFn: () =>
      Donation.GetDonation({
        id: donationId,
        token: session?.user?.access_token,
      }),

    enabled: !!session?.user?.access_token,
  });

  const {
    mutate: updateDonation,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: (data) => {
      return Donation.UpdateDonation({
        data,
        token: session?.user?.access_token,
      });
    },
    onError: (err) => {
      error("Failed to update donation. Please try again.");
    },
    onSuccess: (res) => {
      success("Donation updated successfully!");
      router.push("/donations");
    },
  });

  useEffect(() => {
    if (donation) {
      form.setFieldsValue(donation);
    }
  }, [donation, form]);

  const onFinish = async (values: any) => {
    values["id"] = donationId;
    updateDonation(values);
  };

  if (donationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

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
            // initialValues={donation}
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
              <div className="flex gap-4">
                <Button
                  htmlType="submit"
                  loading={isPending && !isSuccess}
                  disabled={isPending && !isSuccess}
                  className="flex-1"
                >
                  Update Donation
                </Button>
                <Button
                  onClick={() => router.push(`/donations`)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
