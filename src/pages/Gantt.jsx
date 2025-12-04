import { useQuery } from "react-query"
import { getGantt } from "../api/reportApi"

export default function Gantt(){
  const pid = 1  // dynamic via route
  const { data } = useQuery(["gantt",pid],()=>getGantt(pid,"daily"))

  return(
    <div className="bg-white p-5 rounded">
      <h1 className="text-xl font-semibold">Gantt Chart</h1>

      {data?.data?.map(row=>(
        <div key={row.id} className="flex items-center gap-3 p-2 border rounded mt-2">
          <div className="w-40 font-medium">{row.name}</div>
          <div className="text-sm text-gray-600">{row.start} → {row.end}</div>
          <div className="ml-auto font-bold">{row.progress}%</div>
        </div>
      ))}
    </div>
  )
}