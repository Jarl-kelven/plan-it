"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";

const STATUSES = [
  { id: "to_do", label: "To Do", color: "bg-gray-100 dark:bg-gray-800" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-100 dark:bg-blue-950" },
  { id: "done", label: "Done", color: "bg-green-100 dark:bg-green-950" },
];

const PRIORITIES = ["low", "medium", "high"];

export default function TaskBoard({ userId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch tasks in real-time
  useEffect(() => {
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
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

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Get tasks by status
  const getTasksByStatus = (status) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const handleTaskAdded = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;

  return (
    <div>
      {/* Task Form Modal */}
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

      {/* Controls Section */}
      <div className="mb-8 space-y-4">
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          + Add Task
        </button>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">Search Tasks</label>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded text-black"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded text-black"
              >
                <option value="all">All Status</option>
                <option value="to_do">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Found {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Task Columns */}
      {statusFilter === "all" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUSES.map((status) => (
            <div
              key={status.id}
              className={`${status.color} rounded-lg p-6 min-h-96`}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                {status.label} ({getTasksByStatus(status.id).length})
              </h2>

              <div className="space-y-3">
                {getTasksByStatus(status.id).length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No tasks</p>
                ) : (
                  getTasksByStatus(status.id).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
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
        // Single column view when filtering by status
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No tasks match your filters</p>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
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

      {/* Summary */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          {STATUSES.map((status) => (
            <div key={status.id} className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {getTasksByStatus(status.id).length}
              </p>
              <p className="text-gray-600 dark:text-gray-300">{status.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}