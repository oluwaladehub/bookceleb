"use client";

import { Header } from "./Header";
import { Toaster } from 'react-hot-toast';

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Toaster position="top-right" />
    </>
  );
}