import { useQuery } from "react-query"
import { getTasks } from "../api/taskApi"

export default function Tasks(){
  const { data } = useQuery(["tasks"], getTasks)
  const tasks = data?.data || []

  return(
    <div className="grid grid-cols-3 gap-4">
      {["todo","inprogress","done"].map(status=>(
        <Column key={status} title={status} items={tasks.filter(i=>i.status===status)} />
      ))}
    </div>
  )
}

const Column = ({title,items}) =>(
  <div className="bg-gray-100 p-4 rounded">
    <h3 className="font-semibold mb-3">{title.toUpperCase()}</h3>
    {items.map(t=>(
      <div key={t.id} className="bg-white p-3 rounded shadow mb-2">
        <p className="font-medium">{t.name}</p>
        <p className="text-xs text-gray-500">Bobot: {t.bobot}%</p>
      </div>
    ))}
  </div>
)