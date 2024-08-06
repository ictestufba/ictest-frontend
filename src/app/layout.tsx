"use client";

import "./globals.css";

import "antd/dist/reset.css";
import { Suspense } from "react";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
      <Suspense>
      {children}
      </Suspense>
      </body>
    </html>
  );
}
