"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import withAuth from "@/lib/withAuth";

function AnalyticsPage({ user }) {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    toDoTasks: 0,
  });

  useEffect(() => {
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => doc.data());
      
      setStats({
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === "done").length,
        inProgressTasks: tasks.filter(t => t.status === "in_progress").length,
        toDoTasks: tasks.filter(t => t.status === "to_do").length,
      });
    });

    return () => unsubscribe();
  }, [user.uid]);

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Stats</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Tasks */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-600 dark:text-white text-sm font-semibold mb-2">Total Tasks</h2>
            <p className="text-4xl font-bold text-blue-600">{stats.totalTasks}</p>
          </div>

          {/* Completed */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-600 dark:text-white text-sm font-semibold mb-2">Completed</h2>
            <p className="text-4xl font-bold text-green-600">{stats.completedTasks}</p>
          </div>

          {/* In Progress */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-600 dark:text-white text-sm font-semibold mb-2">In Progress</h2>
            <p className="text-4xl font-bold text-yellow-600">{stats.inProgressTasks}</p>
          </div>

          {/* To Do */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-600 dark:text-white text-sm font-semibold mb-2">To Do</h2>
            <p className="text-4xl font-bold text-gray-300">{stats.toDoTasks}</p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-gray-600 dark:text-white text-sm font-semibold mb-4">Completion Rate</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-600 h-4 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-4">{completionRate}%</p>
        </div>
      </div>
    </div>
  );
}

export default withAuth(AnalyticsPage);