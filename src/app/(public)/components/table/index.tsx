import type { TableProps } from 'antd';
import { Table, Tag } from 'antd';
import { NavbarOption } from '../navbar';

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
      case "RUNNING":
        return "success";
      case "PAUSED":
        return "processing";
      case "CANCELED":
        return "error"
      default:
        return "default";
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
  columnType: NavbarOption;
  data: TeamDataType[] | ProjectDataType[];
  pagination: TableProps<any>["pagination"];
  onChange: TableProps<any>["onChange"];
  onRowClick: (id:string)=>void;
}

export function TableList({columnType, data, pagination, onChange, onRowClick}:props) {
  if (columnType === "teams") {
    return (
      <Table 
        columns={getTeamColumnsType()} 
        dataSource={data as TeamDataType[]} 
        pagination={pagination}
        onChange={onChange}
        onRow={(record) => {
          return {
            onClick: () => onRowClick(record.key),
          };
        }}
      />
    );
  }

  return (
    <Table 
      columns={getProjectColumnsType()} 
      dataSource={data} 
      pagination={pagination}
      onChange={onChange}
      onRow={(record) => {
        return {
          onClick: () => onRowClick(record.key),
        };
      }}
    />
  );
};