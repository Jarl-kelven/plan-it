"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import TaskSkeleton from "./TaskSkeleton";

const STATUSES = [
  { id: "to_do", label: "To Do", color: "bg-gray-100" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-100" },
  { id: "done", label: "Done", color: "bg-green-100" },
];

export default function TaskBoard({ userId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch tasks in real-time
  useEffect(() => {
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Get unique categories
  const categories = [...new Set(tasks.map((t) => t.category).filter(Boolean))];

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || task.category === categoryFilter;

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  const handleBulkMarkDone = async () => {
    if (selectedTasks.length === 0) return;

    for (const taskId of selectedTasks) {
      await updateDoc(doc(db, "tasks", taskId), {
        status: "done",
      });
    }
    setSelectedTasks([]);
  };

  // Exporting tasks as CSV is a useful feature for users who want to analyze or share their task data outside of the application. Below is a function that you can add to your `TaskBoard` component to export the filtered tasks as a CSV file.
  const exportTasksAsCSV = () => {
    if (filteredTasks.length === 0) {
      alert("No tasks to export");
      return;
    }

    const headers = [
      "Title",
      "Description",
      "Status",
      "Priority",
      "Category",
      "Due Date",
    ];
    const rows = filteredTasks.map((task) => [
      task.title,
      task.description || "",
      task.status,
      task.priority,
      task.category || "",
      task.dueDate || "",
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.csv";
    a.click();
  };

  const getTasksByStatus = (status) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const handleTaskAdded = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (loading) return <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <TaskSkeleton key={i} />
    ))}
  </div>

  return (
    <div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <TaskForm
            userId={userId}
            task={editingTask}
            onTaskAdded={handleTaskAdded}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        </div>
      )}

      <div className="mb-8 space-y-4">
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          + Add Task
        </button>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white dark:bg-gray-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white dark:bg-gray-700"
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white dark:bg-gray-700"
              >
                <option value="all">All</option>
                <option value="to_do">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white dark:bg-gray-700"
              >
                <option value="all">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {selectedTasks.length > 0 && (
              <button
                onClick={handleBulkMarkDone}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Mark {selectedTasks.length} as Done
              </button>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Found {filteredTasks.length} task
            {filteredTasks.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {statusFilter === "all" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUSES.map((status) => (
            <div
              key={status.id}
              className={`${status.color} dark:bg-gray-800 rounded-lg p-6 min-h-96`}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                {status.label} ({getTasksByStatus(status.id).length})
              </h2>

              <div className="space-y-3">
                {getTasksByStatus(status.id).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tasks</p>
                ) : (
                  getTasksByStatus(status.id).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      selectedTasks={selectedTasks}
                      setSelectedTasks={setSelectedTasks}
                      onEdit={() => {
                        setEditingTask(task);
                        setShowForm(true);
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No tasks match filters
              </p>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  selectedTasks={selectedTasks}
                  setSelectedTasks={setSelectedTasks}
                  onEdit={() => {
                    setEditingTask(task);
                    setShowForm(true);
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}

      <button
        onClick={exportTasksAsCSV}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        📥 Export CSV
      </button>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Summary
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {STATUSES.map((status) => (
            <div key={status.id} className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {getTasksByStatus(status.id).length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{status.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
