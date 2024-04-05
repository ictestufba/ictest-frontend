"use client";
import { TestCase, User } from "@/types/models";
import { getRandomColor } from "@/utils/getRandomColor";
import { CheckSquareOutlined, CloseSquareOutlined, FormOutlined, InfoCircleOutlined, UpSquareOutlined, UserOutlined } from "@ant-design/icons";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import ChartDataLabel from "chartjs-plugin-datalabels";
import { Bar, Pie } from "react-chartjs-2";
import { InfoCard } from "../card/info";
import styles from "./styles.module.css";

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartDataLabel,
  BarElement
);


type GraphSectionProps = {
  cases: {
    [key: string]: TestCase[];
  };
  members: User[];
}

export function GraphSection({cases, members}: GraphSectionProps) {
  const totalErrorCases = cases["error"]?.length ?? 0;
  const totalInProgressCases = cases["in_progress"]?.length ?? 0;
  const totalOpenCases = cases["open"]?.length ?? 0;
  const totalSuccessCases = cases["success"]?.length ?? 0;

  let totalCases = 0;
  for ( const casesPerStatus of Object.values(cases)) {
    totalCases += casesPerStatus.length;
  }

  const casesPerMember: {[key: string]: number}  = {};
  for (const member of members ?? []) {
    casesPerMember[member.name] = 0;
  }
  for (const casesPerStatus of Object.values(cases)) {
    for (const testCase of casesPerStatus) {
      const assignedUser = members?.find(member => member.id === testCase.assigned_to);
      if(assignedUser !== undefined){
        casesPerMember[assignedUser.name]++;
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <InfoCard title="Total: Membros" value={members?.length ?? 0} isLoading={false} icon={
          <UserOutlined style={{
              color: "green",
              backgroundColor: "rgba(0,255,0,0.25)",
              borderRadius: 20,
              fontSize: 24,
              padding: 8,
            }}    
          />}
        />
        <InfoCard title="Total: Casos" value={totalCases} isLoading={false} icon={
          <FormOutlined style={{
              color: "green",
              backgroundColor: "rgba(0,255,0,0.25)",
              borderRadius: 20,
              fontSize: 24,
              padding: 8,
            }} 
          />}
        />
        <InfoCard title="Criado" value={totalOpenCases} isLoading={false}  icon={
          <InfoCircleOutlined style={{
              color: "blue",
              backgroundColor: "rgba(0,255,255,0.25)",
              borderRadius: 20,
              fontSize: 24,
              padding: 8,
            }} 
          />}
        />
        <InfoCard title="Em Progresso" value={totalInProgressCases} isLoading={false} icon={
          <UpSquareOutlined style={{
              color: "yellow",
              backgroundColor: "rgba(255, 206, 86, 1)",
              borderRadius: 20,
              fontSize: 24,
              padding: 8,
            }}  
          />}
        />
        <InfoCard title="Sucesso" value={totalSuccessCases} isLoading={false} icon={
          <CheckSquareOutlined style={{
              color: "green",
              backgroundColor: "rgba(0,255,0,0.25)",
              borderRadius: 20,
              fontSize: 24,
              padding: 8,
            }} 
          />}
        />
        <InfoCard title="Erro" value={totalErrorCases} isLoading={false} icon={
          <CloseSquareOutlined style={{
              color: "red",
              backgroundColor: "rgba(255,0,0,0.25)",
              borderRadius: 20,
              fontSize: 24,
              padding: 8,
            }} 
          />}
        />
      </div>     
      <div className={styles.bottomContainer}>
        <div className={styles.leftBottomContainer}>
          <Bar
              data={(()=>{
                const listedMembers = Object.keys(casesPerMember);
                return {
                  labels: Object.keys(casesPerMember),
                  datasets: [
                    {
                      data: listedMembers.map(member => casesPerMember[member]),
                      backgroundColor:listedMembers.map(() => getRandomColor())
                    }
                  ]
                }
              })()}
            options={{
              scales:{
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      if(typeof value == 'number' && value % 1 == 0){
                        return value;
                      }
                    }
                  }
                }
              },
              plugins:{
                datalabels: {
                  formatter: () => {
                    return "";
                  }
                },
                legend:{
                  display:false
                },
                title:{
                  display:true,
                  text: "Card por Membro",
                  font:{
                    size:23,
                    weight:300,
                  },
                  position: "bottom"
                }
              }
            }}
          />
        </div>
        <div className={styles.rightBottomContainer}>
          <Pie
            data={{
              labels: [
                "SUCESSO",
                "ERRO",
                "EM PROGRESSO",
                "CRIADO",
              ],
              datasets: [
                {
                  data: [totalSuccessCases, totalErrorCases, totalInProgressCases, totalOpenCases],
                  backgroundColor: [
                    'rgba(106, 218, 50, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)'
                  ],
                  
                },
              ],
            }} 
            options={{
              plugins: {
                datalabels: {
                  font:{
                    size:23,
                    weight:400,
                  },
                  formatter: (value) => {
                    const percentageValue = (value/totalCases);
                    if (percentageValue === 0){
                      return ""
                    }
                    return `${(percentageValue  * 100).toFixed(2).replace(/[.,]00$/, "")}%`;
                  }
                },
                legend:{
                  display:true,
                  position: "left",
                },
                title:{
                  display:true,
                  text: "",
                  font:{
                    size:20,
                    weight:300,
                  },
                  position: "bottom"
                }
              },
            }}
          />
        </div> 
      </div>     
    </div>
  );
}
