"use client";

// import { Roboto } from "next/font/google";

import { Button, Col, Row, Typography } from "antd";
import Link from "next/link";


export default function Home() {
  return (
    <main>
      {/* <Navbar />
      <Board initialCases={{
        "open":[
          {
            id: "1",
            title: "Teste de exemplo",
            description: "Descrição do teste",
            status: "open",
            priority: "high",
            assigned_to: "1",
            project_id: "1",
            severity: "normal",
            attachment:null,
            type: "functional",
            created_at: "2021-08-10T00:00:00.000Z",
            layer:"unit",
            is_flaky: false,
            automation_status: "automated",
            behavior: "positive",
            deadline: "2021-08-10T00:00:00.000Z",
          },
          {
            id: "10",
            title: "Teste de exemplo 10",
            description: "Descrição do teste",
            status: "open",
            priority: "high",
            assigned_to: "1",
            project_id: "1",
            severity: "normal",
            attachment:null,
            type: "functional",
            created_at: "2021-08-10T00:00:00.000Z",
            layer:"unit",
            is_flaky: false,
            automation_status: "automated",
            behavior: "positive",
            deadline: "2021-08-10T00:00:00.000Z",
          }
        ],
        "in_progress": [
          {
            id: "2",
            title: "Teste de exemplo 2",
            description: "Descrição do teste 2",
            status: "in_progress",
            priority: "high",
            assigned_to: "1",
            project_id: "1",
            severity: "normal",
            attachment:null,
            type: "functional",
            created_at: "2021-08-10T00:00:00.000Z",
            layer:"unit",
            is_flaky: false,
            automation_status: "automated",
            behavior: "positive",
            deadline: "2021-08-10T00:00:00.000Z",
          }
        ],
        "error":[
          {
            id: "3",
            title: "Teste de exemplo 3",
            description: "Descrição do teste 2",
            status: "error",
            priority: "high",
            assigned_to: "1",
            project_id: "1",
            severity: "normal",
            attachment:null,
            type: "functional",
            created_at: "2021-08-10T00:00:00.000Z",
            layer:"unit",
            is_flaky: false,
            automation_status: "automated",
            behavior: "positive",
            deadline: "2021-08-10T00:00:00.000Z",
          }
        ],
        "success":[
          {
            id: "4",
            title: "Teste de exemplo 4",
            description: "Descrição do teste 2",
            status: "success",
            priority: "high",
            assigned_to: "1",
            project_id: "1",
            severity: "normal",
            attachment:null,
            type: "functional",
            created_at: "2021-08-10T00:00:00.000Z",
            layer:"unit",
            is_flaky: false,
            automation_status: "automated",
            behavior: "positive",
            deadline: "2021-08-10T00:00:00.000Z",
          }
        ]
      }}></Board> */}
      {/* <ModelCard 
        id={"2"} 
        title="Time de Monetização" 
        description="Responsável: Erick Kokubum" 
        bottomText="Número de membros: 10" 
        onClick={()=>console.log("clicked")}
      />
      <TestCaseCard onClick={()=>{console.log('Teste')}} testCase={{
        id: "1",
        title: "Teste de exemplo",
        description: "Descrição do teste",
        status: "success",
        priority: "high",
        assigned_to: "1",
        project_id: "1",
        severity: "normal",
        attachment:null,
        type: "functional",
        created_at: "2021-08-10T00:00:00.000Z",
        layer:"unit",
        is_flaky: false,
        automation_status: "automated",
        behavior: "positive",
        deadline: "2021-08-10T00:00:00.000Z",
      }} />
      <SearchBar placeholder="Filtre pelo nome..." onChange={(e)=>{
        console.log(e.target.value)
      }}
      onSearch={(value)=>{
        console.log(value)
      }}
      />
      <TableList columnType="project" data={data} pagination={{position: ["bottomCenter"], responsive: true}} onChange={()=>console.log("FOI")} /> */}
      {/* <ModelCard 
        id={"1"} 
        title="Time de Monetização" 
        description="Responsável: Erick Kokubum" 
        bottomText="Número de membros: 10" 
        onClick={()=>console.log("clicked")}
      />
        <ModelCard 
        id={"2"} 
        title="Time de Monetização" 
        description="Responsável: Erick Kokubum" 
        bottomText="Número de membros: 10" 
        onClick={()=>console.log("clicked")}
      />
       <ModelCard 
        id={"3"} 
        title="Time de Monetização" 
        description="Responsável: Erick Kokubum" 
        bottomText="Número de membros: 10" 
        onClick={()=>console.log("clicked")}
      />
      <ModelCard 
        id={"4"} 
        title="Projeto Pagamentos" 
        description="Responsável: Erick Kokubum" 
        bottomText="Casos de teste: 10" 
        onClick={()=>console.log("clicked")}
      /> */}
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
