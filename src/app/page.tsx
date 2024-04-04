"use client";

import { Button, Col, Row, Typography } from "antd";
import Link from "next/link";


export default function Home() {
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
