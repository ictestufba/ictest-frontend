"use client";

// import { Roboto } from "next/font/google";

import { Row, Col, Button, Typography } from "antd";
import Link from "next/link";

// const roboto = Roboto({
//   weight: ["100", "300", "400", "500", "700"],
// });

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_API_URL)

  return (
    <main>
      <Row justify="center">
        <Typography.Title>Landing Page</Typography.Title>
      </Row>
      <Row justify="center">
        <Col>
          <Link href="/login">
            <Button type="primary">Ir para dashboard ↗</Button>
          </Link>
        </Col>
      </Row>
    </main>
  );
}
