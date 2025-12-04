import { useQuery } from "react-query"
import { getProjects } from "../api/projectApi"

export default function Projects(){
  const { data } = useQuery(["projects"], getProjects)

  return(
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button className="btn-primary">+ New Project</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {data?.data?.map(p=>(
          <div key={p.id} className="p-5 bg-white rounded-lg shadow">
            <div className="font-semibold">{p.name}</div>
            <p className="text-sm text-gray-600">{p.priority}</p>
            <p className="text-xs mt-1">{p.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}