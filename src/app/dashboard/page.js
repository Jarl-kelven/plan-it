"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import withAuth from "@/lib/withAuth";

function Dashboard({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Welcome, {user.email}!
        </h1>

        <p className="text-gray-700 mb-6">
          You are successfully logged in to your dashboard.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Your User ID: {user.uid}
        </p>

        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition"
        >
          Logout
        </button>
      </div>
      
    </div>
  );
}

export default withAuth(Dashboard);