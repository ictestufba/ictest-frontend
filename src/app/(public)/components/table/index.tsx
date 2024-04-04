import type { TableProps } from 'antd';
import { Table, Tag } from 'antd';
import styles from "./styles.module.css";


export interface TeamDataType {
  key: string;
  name: string;
  department: string;
  members: number;
  responsible: string;
}

function getTeamColumnsType():TableProps<TeamDataType>['columns']{
  return [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Departamento',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Membros',
      dataIndex: 'members',
      key: 'members',
    },
    {
      title: 'Responsável',
      dataIndex: 'responsible',
      key: 'responsible',
    },
  ]
}

export interface ProjectDataType {
  key: string;
  name: string;
  code: string;
  status: string;
  responsible: string;
}

function getProjectColumnsType():TableProps<ProjectDataType>['columns']{
  const getStatusColor = (status:string) =>{
    switch(status.toUpperCase()){
      case "FINALIZADO":
        return "success";
      case "EM PROGRESSO":
        return "yellow";
      case "ERRO":
        return "error"
      default:
        return "processing";
    }
  }
  return [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => (
        <>
          {
            <Tag color={getStatusColor(status)}>
              {status.toUpperCase()}
            </Tag>
          }
        </>
      ),
    },
    {
      title: 'Responsável',
      dataIndex: 'responsible',
      key: 'responsible',
    },
  ]
}

type props = {
  data: TeamDataType[] | ProjectDataType[];
  pagination: TableProps<any>["pagination"];
  onChange: TableProps<any>["onChange"];
  onRowClick: (id:string)=>void;
}

export function TableList({data, pagination, onChange, onRowClick}:props) {
  return (
    <Table 
      columns={getProjectColumnsType()} 
      dataSource={data} 
      pagination={pagination}
      onChange={onChange}
      rowClassName={styles.row}
      onRow={(record) => {
        return {
          onClick: () => onRowClick(record.key),
        };
      }}
    />
  );
};