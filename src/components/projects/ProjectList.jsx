import { useEffect, useState } from "react";
import {
    getProjects,
    createProject,
    deleteProject,
} from "../../services/projectService";

import { Edit2, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import { getPriorityColor } from "../../utils/getPriorityColor";
import { getStatusColor } from "../../utils/getStatusColor";
import { calculateProjectProgress } from "../../utils/calculateProjectProgress";
import { Calendar, Clock, Trash2 } from "lucide-react";

const ProjectList = ({ tasks, currentUser }) => {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleEditOpen = (project) => {
        setSelectedProject(project);
        setForm({
            name: project.name,
            deskripsi: project.deskripsi,
            priority: project.priority,
            start_date: project.start_date?.split("T")[0],
            due_date: project.due_date?.split("T")[0],
            status: project.status,
        });
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            start_date: form.start_date, // ✅ KIRIM YYYY-MM-DD SAJA
            due_date: form.due_date,     // ✅ TANPA T00:00:00
        };

        console.log("📤 PAYLOAD UPDATE DIKIRIM:", payload);

        try {
            await api.put(`/projects/${selectedProject.id}`, payload);
            setShowEditModal(false);
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const [form, setForm] = useState({
        name: "",
        deskripsi: "",
        priority: "medium",
        start_date: "",
        due_date: "",
        status: "inprogress",
    });


    // ✅ FETCH PROJECT DARI EXPRESS
    const fetchProjects = async () => {
        try {
            const res = await getProjects();
            setProjects(res.data);
        } catch (err) {
            console.error("❌ Gagal fetch projects:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...form,
                start_date: form.start_date, // ✅ YYYY-MM-DD SAJA
                due_date: form.due_date,     // ✅ TANPA JAM
            };


            await createProject(payload);

            // await createProject(form); // ✅ LANGSUNG SESUAI STRUKTUR API
            setShowModal(false);
            fetchProjects();

            setForm({
                name: "",
                deskripsi: "",
                priority: "medium",
                start_date: "",
                due_date: "",
                status: "inprogress",
            });
        } catch (err) {
            console.error("❌ Gagal create project:", err);
        }
    };


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };



    const formatDate = (dateString) => {
        if (!dateString) return "-";

        // ✅ Normalisasi: buang jam & timezone
        const cleanDate = dateString.split("T")[0]; // "2025-12-07"

        const [year, month, day] = cleanDate.split("-");

        return new Date(year, month - 1, day).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };






    const handleDelete = async (id) => {
        if (!window.confirm("Yakin hapus?")) return;

        try {
            await deleteProject(id);
            fetchProjects();
        } catch (err) {
            console.error("❌ Gagal hapus:", err);
        }
    };

    if (loading) return <div>Loading projects...</div>;

    const sortByPriorityAndDate = (projects) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };

        return [...projects].sort((a, b) => {
            const priorityDiff =
                priorityOrder[b.priority] - priorityOrder[a.priority];

            if (priorityDiff !== 0) return priorityDiff;

            return new Date(a.due_date) - new Date(b.due_date); // yg paling dekat dulu
        });
    };
    const userProjects = sortByPriorityAndDate(projects);

    // const userProjects = projects;



    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Projects</h1>

                {/* {currentUser.role === "super_admin" && ( */}
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    + New Project
                </button>

                {/* )} */}
            </div>

            {/* LIST PROJECT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProjects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {project.name}
                                </h3>

                                {/* {currentUser.role === "super_admin" && ( */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditOpen(project)}
                                        className="text-gray-600 hover:text-blue-600"
                                    >
                                        <Edit2 size={16} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="text-gray-600 hover:text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                {/* )} */}
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                {project.deskripsi}
                            </p>

                            <div className="flex gap-2 mb-4">
                                <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(
                                        project.priority
                                    )}`}
                                >
                                    {project.priority}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                                        project.status
                                    )}`}
                                >
                                    {project.status}
                                </span>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>
                                        {calculateProjectProgress(project.id, tasks)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{
                                            width: `${calculateProjectProgress(
                                                project.id,
                                                tasks
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{formatDate(project.start_date)}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Clock size={14} />
                                    <span>{formatDate(project.due_date)}</span>
                                </div>

                            </div>

                            <button
                                onClick={() => navigate(`/projects/${project.id}`)}
                                className="mt-4 w-full bg-gray-100 py-2 rounded hover:bg-gray-200"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ MODAL CREATE */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-start sm:items-center z-50 px-4 py-6">

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white w-full sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-4 sm:p-6 space-y-4"
                    >
                        <h2 className="text-xl font-bold">Create Project</h2>

                        {/* NAME */}
                        <div>
                            <label className="text-sm font-medium">Project Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mt-1"
                                required
                            />
                        </div>

                        {/* DESKRIPSI */}
                        <div>
                            <label className="text-sm font-medium">Deskripsi</label>
                            <textarea
                                name="deskripsi"
                                value={form.deskripsi}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mt-1"
                                rows={3}
                                required
                            />
                        </div>

                        {/* PRIORITY */}
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

                        {/* START & DUE DATE */}
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
                        {/* STATUS & GANTT */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        </div>

                        {/* ACTION */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border rounded w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                            >
                                Save Project
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ✅ MODAL UPDATE PROJECT */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-start sm:items-center z-50 px-4 py-6">
                    <form
                        onSubmit={handleUpdate}
                        className="bg-white w-full sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-4 sm:p-6 space-y-4"
                    >
                        <h2 className="text-xl font-bold">Update Project</h2>

                        {/* NAME */}
                        <div>
                            <label className="text-sm font-medium">Project Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mt-1"
                                required
                            />
                        </div>

                        {/* DESKRIPSI */}
                        <div>
                            <label className="text-sm font-medium">Deskripsi</label>
                            <textarea
                                name="deskripsi"
                                value={form.deskripsi}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mt-1"
                                rows={3}
                                required
                            />
                        </div>

                        {/* PRIORITY */}
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

                        {/* START & DUE DATE */}
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

                        {/* STATUS & GANTT */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                        </div>
                        {/* ACTION */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 border rounded w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                            >
                                Update Project
                            </button>
                        </div>
                    </form>
                </div>
            )}



        </div>
    );
};

export default ProjectList;