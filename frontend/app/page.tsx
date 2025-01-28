import { Button } from "antd";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <HeartHandshake className="mx-auto h-16 w-16 text-blue-600" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Make a Difference Today
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Your generosity can change lives. Every donation counts.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/donate">
              <Button size="large">Make a Donation</Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="large">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
