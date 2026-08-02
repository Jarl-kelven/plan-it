"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const PRIORITY_COLORS = {
  low: "bg-green-200 text-green-800",
  medium: "bg-yellow-200 text-yellow-800",
  high: "bg-red-200 text-red-800",
};

export default function TaskCard({ task, onEdit, selectedTasks, setSelectedTasks }) {
  const [deleting, setDeleting] = useState(false);
 

 

  function getDaysUntilDue(dueDate) {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  }
  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;

    setDeleting(true);
    try {
      await deleteDoc(doc(db, "tasks", task.id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    setDeleting(false);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateDoc(doc(db, "tasks", task.id), {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <h3 className="font-bold text-gray-800 mb-2">{task.title}</h3>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}

      <div className="flex items-center gap-2 mb-3">
        {task.category && (
          <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-200 text-purple-800">
            {task.category}
          </span>
        )}

        {task.priority && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${PRIORITY_COLORS[task.priority] || "bg-gray-200"}`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        )}

        {task.dueDate && (
          <div className="mt-2 pt-2 border-t">
            {(() => {
              const daysLeft = getDaysUntilDue(task.dueDate);
              const isOverdue = daysLeft < 0;
              const isDueToday = daysLeft === 0;
              const isDueSoon = daysLeft > 0 && daysLeft <= 3;

              return (
                <p
                  className={`text-xs font-semibold ${
                    isOverdue
                      ? "text-red-600"
                      : isDueToday
                        ? "text-orange-600"
                        : isDueSoon
                          ? "text-yellow-600"
                          : "text-gray-600"
                  }`}
                >
                  {isOverdue
                    ? `⚠️ Overdue by ${Math.abs(daysLeft)} day(s)`
                    : isDueToday
                      ? "📌 Due today!"
                      : isDueSoon
                        ? `⏰ Due in ${daysLeft} day(s)`
                        : `📅 Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                </p>
              );
            })()}
          </div>
        )}

        {task.dueDate && (
          <span className="text-xs text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition disabled:opacity-50"
        >
          {deleting ? "..." : "Delete"}
        </button>
      </div>

      {/* Status quick-change */}
      <div className="mt-3 pt-3 border-t">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full p-2 text-sm border rounded text-black bg-white"
        >
          <option value="to_do">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedTasks.includes(task.id)}
          onChange={() => {
            setSelectedTasks((prev) =>
              prev.includes(task.id)
                ? prev.filter((id) => id !== task.id)
                : [...prev, task.id],
            );
          }}
          className="mr-2"
        />
        <label className="text-sm text-gray-600">Select task</label>
      </div>
    </div>
  );
}
