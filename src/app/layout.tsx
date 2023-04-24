"use client";

import "./globals.css";

import "antd/dist/reset.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <>{children}</>
      </body>
    </html>
  );
}
