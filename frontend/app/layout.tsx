import "@ant-design/v5-patch-for-react-19";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { MessageProvider } from "./providers/messageProvider";
import ReactQueryProvider from "./providers/reactqueryProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ReactQueryProvider>
          <Providers>
            <MessageProvider>{children}</MessageProvider>
          </Providers>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
