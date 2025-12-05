import axios from "axios";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import KanbanColumn from "./KanbanColumn.jsx";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

const KanbanBoard = ({ project, tasks, onUpdateTask, onCreateTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    deskripsi: "",
    priority: "medium",
    bobot: 10,
    start_date: "",
    due_date: "",
    status: "todo",
    user_id: null,
  });

  const projectTasks = tasks.filter((t) => t.project_id === project.id);

  const [columns, setColumns] = useState({
    todo: projectTasks.filter((t) => t.status === "todo"),
    inprogress: projectTasks.filter((t) => t.status === "inprogress"),
    done: projectTasks.filter((t) => t.status === "done"),
  });

  useEffect(() => {
    setColumns({
      todo: projectTasks.filter((t) => t.status === "todo"),
      inprogress: projectTasks.filter((t) => t.status === "inprogress"),
      done: projectTasks.filter((t) => t.status === "done"),
    });
  }, [tasks]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  const handleUserSelect = (e) => {
    setForm((prev) => ({
      ...prev,
      user_id: Number(e.target.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      project_id: project.id,
    };

    await onCreateTask(payload);
    setShowModal(false);

    setForm({
      name: "",
      deskripsi: "",
      priority: "medium",
      bobot: 10,
      start_date: "",
      due_date: "",
      status: "todo",
      user_id: null,
    });
  };

  // ✅ DRAG & DROP HANDLER
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // ✅ Jika dilepas di luar kolom
    if (!destination) return;

    // ✅ Jika masih di kolom yang sama
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;

    // ✅ Cari task yang dipindahkan
    const movedTask = tasks.find(
      (task) => task.id.toString() === draggableId
    );

    if (!movedTask) return;

    try {
      // ✅ Payload untuk backend
      const payload = {
        status: newStatus,
        done_date:
          newStatus === "done"
            ? new Date().toISOString().slice(0, 10)
            : null,
      };

      // ✅ Update ke backend
      await axios.put(
        `${import.meta.env.VITE_API_URL}/projects/${project.id}/tasks/${movedTask.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );


      // ✅ Update state frontend agar UI langsung berubah
      if (typeof onUpdateTask === "function") {
        onUpdateTask({
          ...movedTask,
          status: newStatus,
          done_date: payload.done_date,
        });
      }
    } catch (error) {
      console.error("Gagal update status task:", error);
    }
  };



  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Task Board - {project.name}
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* ✅ KANBAN DRAG AREA */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["todo", "inprogress", "done"].map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <KanbanColumn
                    title={
                      status === "todo"
                        ? "To Do"
                        : status === "inprogress"
                          ? "In Progress"
                          : "Done"
                    }
                    tasks={columns[status]}
                    status={status}
                    color={
                      status === "todo"
                        ? "gray"
                        : status === "inprogress"
                          ? "blue"
                          : "green"
                    }
                    users={users}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* ✅ MODAL CREATE TASK (KODE KAMU TIDAK DIUBAH) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start sm:items-center z-50 px-4 py-6">

          <form
            onSubmit={handleSubmit}
            className="bg-white w-full sm:max-w-xl md:max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-4 sm:p-6"
          >
            <h2 className="text-xl font-bold mb-4">Create Task</h2>

            {/* GRID 2 KOLOM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* KIRI */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Task Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mt-1"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mt-1"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* KANAN */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Bobot (%)</label>
                  <input
                    type="number"
                    name="bobot"
                    value={form.bobot}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    className="w-full border p-2 rounded mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      value={form.start_date}
                      onChange={handleChange}
                      className="w-full border p-2 rounded mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <input
                      type="date"
                      name="due_date"
                      value={form.due_date}
                      onChange={handleChange}
                      className="w-full border p-2 rounded mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mt-1"
                  >
                    <option value="todo">Todo</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Assign User</label>
                  <select
                    onChange={handleUserSelect}
                    className="w-full border p-2 rounded mt-1"
                    required
                  >
                    <option value="">-- Pilih User --</option>
                    {Array.isArray(users) && users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* TOMBOL */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded w-full sm:w-auto"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;



//  {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-start sm:items-center z-50 px-4 py-6">

//           <form
//             onSubmit={handleSubmit}
//             className="bg-white w-full sm:max-w-xl md:max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-4 sm:p-6"
//           >
//             <h2 className="text-xl font-bold mb-4">Create Task</h2>

//             {/* GRID 2 KOLOM */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//               {/* KIRI */}
//               <div className="space-y-3">
//                 <div>
//                   <label className="text-sm font-medium">Task Name</label>
//                   <input
//                     name="name"
//                     value={form.name}
//                     onChange={handleChange}
//                     className="w-full border p-2 rounded mt-1"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Deskripsi</label>
//                   <textarea
//                     name="deskripsi"
//                     value={form.deskripsi}
//                     onChange={handleChange}
//                     className="w-full border p-2 rounded mt-1"
//                     rows={4}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Priority</label>
//                   <select
//                     name="priority"
//                     value={form.priority}
//                     onChange={handleChange}
//                     className="w-full border p-2 rounded mt-1"
//                   >
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                   </select>
//                 </div>
//               </div>

//               {/* KANAN */}
//               <div className="space-y-3">
//                 <div>
//                   <label className="text-sm font-medium">Bobot (%)</label>
//                   <input
//                     type="number"
//                     name="bobot"
//                     value={form.bobot}
//                     onChange={handleChange}
//                     min="1"
//                     max="100"
//                     className="w-full border p-2 rounded mt-1"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <div>
//                     <label className="text-sm font-medium">Start Date</label>
//                     <input
//                       type="date"
//                       name="start_date"
//                       value={form.start_date}
//                       onChange={handleChange}
//                       className="w-full border p-2 rounded mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">Due Date</label>
//                     <input
//                       type="date"
//                       name="due_date"
//                       value={form.due_date}
//                       onChange={handleChange}
//                       className="w-full border p-2 rounded mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Status</label>
//                   <select
//                     name="status"
//                     value={form.status}
//                     onChange={handleChange}
//                     className="w-full border p-2 rounded mt-1"
//                   >
//                     <option value="todo">Todo</option>
//                     <option value="inprogress">In Progress</option>
//                     <option value="done">Done</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Assign User</label>
//                   <select
//                     onChange={handleUserSelect}
//                     className="w-full border p-2 rounded mt-1"
//                     required
//                   >
//                     <option value="">-- Pilih User --</option>
//                     {Array.isArray(users) && users.map((user) => (
//                       <option key={user.id} value={user.id}>
//                         {user.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* TOMBOL */}
//             <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
//               <button
//                 type="button"
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 border rounded w-full sm:w-auto"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-6 py-2 rounded w-full sm:w-auto"
//               >
//                 Save Task
//               </button>
//             </div>
//           </form>
//         </div>
//       )}