"use client";
import { useState, useEffect, startTransition } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { useNotification } from "@/lib/notifications";

export default function TaskForm({ userId, task, onTaskAdded, onCancel }) {
  const { showNotification } = useNotification();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("to_do");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("")
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load task data if editing
  useEffect(() => {
    if (task) {
      startTransition(() => {
        setTitle(task.title);
        setDescription(task.description || "");
        setStatus(task.status);
        setPriority(task.priority || "medium");
        setCategory(task.category || "");
        setDueDate(task.dueDate || "");
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    setLoading(true);

    try {
      if (task) {
        // Update existing task
        await updateDoc(doc(db, "tasks", task.id), {
          title,
          description,
          status,
          priority,
          category,
          dueDate,
          updatedAt: new Date(),
        });
      } else {
        // Create new task
        await addDoc(collection(db, "tasks"), {
          title,
          description,
          status,
          priority,
          category,
          dueDate,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      showNotification("Task saved successfully!", "success");
      onTaskAdded();
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to save task");
      showNotification("Failed to save task", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {task ? "Edit Task" : "Create Task"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-black"
            placeholder="Task title"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-black"
            placeholder="Task description"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-black"
          >
            <option value="to_do">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-black"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-black"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Work, Personal, Shopping"
            className="w-full p-3 border border-gray-300 rounded text-black"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
          >
            {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
