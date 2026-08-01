"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import TaskBoard from "@/components/TaskBoard";
import withAuth from "@/lib/withAuth";

function TasksPage({ user }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Task Manager</h1>
            <p className="text-gray-600 dark:text-gray-200 mt-2">Welcome, {user.displayName || user.email}</p>
          </div>
        </div>

        <TaskBoard userId={user.uid} />
      </div>
    </div>
  );
}

export default withAuth(TasksPage);