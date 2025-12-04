import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import KanbanColumn from "./KanbanColumn.jsx";

const KanbanBoard = ({ project, tasks, onUpdateTask, onCreateTask }) => {
  const [showModal, setShowModal] = useState(false);

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    deskripsi: "",
    priority: "medium",
    bobot: 0,
    start_date: "",
    due_date: "",
    status: "todo",
    user_id: []
  });


  const projectTasks = tasks.filter((t) => t.project_id === project.id);

  const columns = {
    todo: projectTasks.filter((t) => t.status === "todo"),
    inprogress: projectTasks.filter((t) => t.status === "inprogress"),
    done: projectTasks.filter((t) => t.status === "done"),
  };

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get("/users"); // sesuaikan endpoint kalau beda
      setUsers(res.data);
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (e) => {
    const userId = Number(e.target.value);

    setForm((prev) => ({
      ...prev,
      assigned_user: [userId] // API kamu minta array
    }));
  };



  // ✅ HANDLE CHECKBOX USER
  const handleUserChange = (id) => {
    setForm((prev) => ({
      ...prev,
      assigned_user: [id], // ✅ sesuai API kamu (array)
    }));
  };

  // ✅ SUBMIT KE API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      project_id: project.id, // penting untuk relasi ke project
    };

    await onCreateTask(payload); // ✅ dilempar ke parent (API)
    setShowModal(false);

    setForm({
      name: "",
      deskripsi: "",
      priority: "medium",
      bobot: 10,
      start_date: "",
      due_date: "",
      status: "todo",
      assigned_user: [],
    });
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

      {/* KANBAN COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KanbanColumn
          title="To Do"
          tasks={columns.todo}
          status="todo"
          color="gray"
          onUpdateTask={onUpdateTask}
        />
        <KanbanColumn
          title="In Progress"
          tasks={columns.inprogress}
          status="inprogress"
          color="blue"
          onUpdateTask={onUpdateTask}
        />
        <KanbanColumn
          title="Done"
          tasks={columns.done}
          status="done"
          color="green"
          onUpdateTask={onUpdateTask}
        />
      </div>

      {/* ✅ MODAL CREATE TASK */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6"
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

                <div className="grid grid-cols-2 gap-3">
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
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* TOMBOL */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded"
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
