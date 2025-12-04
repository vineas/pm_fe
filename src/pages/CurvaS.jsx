import { useQuery } from "react-query"
import { getCurvaS } from "../api/reportApi"
import { Line } from "react-chartjs-2"

export default function CurvaS(){
  const pid = 1
  const { data } = useQuery(["curva",pid],()=>getCurvaS(pid,"2025-01-01","2025-01-30"))

  const chart = {
    labels:data?.data?.labels,
    datasets:[
      { label:"Planned", data:data?.data?.planned, borderColor:"#3b82f6" },
      { label:"Actual", data:data?.data?.actual, borderColor:"#10b981" }
    ]
  }

  return <Line data={chart}/>
}