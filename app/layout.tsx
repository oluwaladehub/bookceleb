import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "./components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'BookCeleb',
  description: 'Book your favorite celebrities for events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}