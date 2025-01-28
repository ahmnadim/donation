"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Card, Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useMessage } from "@/app/providers/messageProvider";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status }: any = useSession();
  const { error, success } = useMessage();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        error("Invalid credentials");
      } else {
        success("Signed in successfully");
        router.push("/admin");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "USER") {
        router.replace("/donations");
      } else {
        router.replace("/admin");
      }
    }
  }, [status, session, router]);

  if (status == "loading") {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Sign In</h2>
        </div>

        <Form
          name="signin"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input size="large" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full bg-primary"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
