"use client";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";

export default function withAuth(Component) {
  return function ProtectedComponent(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
        } else {
          router.push("/login");
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return (
        <div className="flex flex-col items-center mt-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-center mt-4 text-blue-600 font-medium">
            Loading...
          </p>
        </div>
      );
    }
    // If we get here, user is logged in
    return <Component user={user} {...props} />;
  };
}
