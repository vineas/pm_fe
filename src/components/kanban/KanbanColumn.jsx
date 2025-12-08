import React from "react";
import { Calendar, User } from "lucide-react";
import { getPriorityColor } from "../../utils/getPriorityColor";
import { Draggable } from "@hello-pangea/dnd";

const KanbanColumn = ({ title, tasks, status, color, users = [], onEditTask  }) => {
  const bgColors = {
    gray: "bg-gray-100",
    blue: "bg-blue-50",
    green: "bg-green-50",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ AMBIL NAMA USER DARI user_id
  const getUserName = (task) => {
    if (task.user_name) return task.user_name;
    const user = users.find((u) => u.id === task.user_id);
    return user ? user.name : "Unassigned";
  };

  return (
    <div className={`${bgColors[color]} rounded-lg p-4 min-h-[400px]`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <span className="bg-white px-2 py-1 rounded text-sm font-semibold">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <Draggable
            key={task.id}
            draggableId={task.id.toString()}
            index={index}
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() => onEditTask(task)}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {task.name}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {task.deskripsi}
                </p>

                {/* ✅ USER */}
                <div className="flex items-center gap-2 text-xs text-gray-700 mb-2">
                  <User size={14} />
                  <span className="font-medium">{getUserName(task)}</span>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span className="font-semibold">
                    Bobot: {task.bobot}%
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{formatDate(task.due_date)}</span>
                  </div>
                </div>
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
