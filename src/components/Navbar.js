"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/lib/darkModeContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { isDark, toggle } = useDarkMode();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <nav className={`w-full ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'} p-4 flex justify-between items-center sticky top-0 z-50 transition`}>
      <Link href="/" className="text-xl font-bold">PlanIt</Link>
      
      <ul className="hidden md:flex space-x-6">
        <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
        <li><Link href="/about" className="hover:text-blue-400">About</Link></li>
        <li><Link href="/contact" className="hover:text-blue-400">Contact</Link></li>
        <li><Link href="/tasks" className="hover:text-blue-400">Tasks</Link></li>
        
        {user ? (
          <>
            <li><Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link></li>
            <li><button onClick={handleLogout} className="hover:text-red-400">Logout ({user.email})</button></li>
          </>
        ) : (
          <>
            <li><Link href="/login" className="hover:text-blue-400">Login</Link></li>
            <li><Link href="/signup" className="hover:text-blue-400">Sign Up</Link></li>
          </>
        )}
        
        {/* Dark Mode Toggle */}
        <li>
          <button 
            onClick={toggle}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
            title="Toggle dark mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </li>
      </ul>

      <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        ☰
      </button>

      {isMobileMenuOpen && (
        <ul className={`absolute top-16 left-0 w-full ${isDark ? 'bg-gray-900' : 'bg-gray-800'} flex flex-col space-y-4 p-4`}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/tasks">Tasks</Link></li>
          {user ? (
            <>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/signup">Sign Up</Link></li>
            </>
          )}
          <li>
            <button onClick={toggle} className="px-3 py-1 rounded bg-gray-700">
              {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}