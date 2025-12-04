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

    const [form, setForm] = useState({
        name: "",
        deskripsi: "",
        priority: "medium",
        start_date: "",
        due_date: "",
        status: "inprogress",
        ganchart_type: "weekly",
        curva_s: true,
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
            await createProject(form); // ✅ LANGSUNG SESUAI STRUKTUR API
            setShowModal(false);
            fetchProjects();

            setForm({
                name: "",
                deskripsi: "",
                priority: "medium",
                start_date: "",
                due_date: "",
                status: "inprogress",
                ganchart_type: "weekly",
                curva_s: true,
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
        return new Date(dateString).toLocaleDateString("id-ID", {
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
    const userProjects =
        currentUser?.role === "super_admin"
            ? projects
            : projects.filter((p) => p.users?.includes(currentUser?.id));

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Projects</h1>

                {currentUser.role === "super_admin" && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        + New Project
                    </button>

                )}
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

                                {currentUser.role === "super_admin" && (
                                    <div className="flex gap-2">
                                        <button className="text-gray-600 hover:text-blue-600">
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="text-gray-600 hover:text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                {project.description}
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
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 space-y-4"
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
                                className="w-full border p-2 rounded"
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
                                className="w-full border p-2 rounded"
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
                                className="w-full border p-2 rounded"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        {/* START & DUE DATE */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">Start Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={form.start_date}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Due Date</label>
                                <input
                                    type="date"
                                    name="due_date"
                                    value={form.due_date}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                        </div>

                        {/* STATUS */}
                        <div className="grid grid-cols-2 gap-3">

                        <div>
                            <label className="text-sm font-medium">Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="todo">Todo</option>
                                <option value="inprogress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        {/* GANTT TYPE */}
                        <div>
                            <label className="text-sm font-medium">Gantt Type</label>
                            <select
                                name="ganchart_type"
                                value={form.ganchart_type}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        </div>

                        {/* CURVA S */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="curva_s"
                                checked={form.curva_s}
                                onChange={handleChange}
                            />
                            <label className="text-sm">Enable Curva S</label>
                        </div>

                        {/* ACTION */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Save Project
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
};

export default ProjectList;
