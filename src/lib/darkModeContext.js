"use client";
import { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;

    try {
      return window.localStorage.getItem("darkMode") === "true";
    } catch {
      return false;
    }
  });

  // Keep the document and localStorage synchronized with React state.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);

    try {
      window.localStorage.setItem("darkMode", JSON.stringify(isDark));
    } catch {
      // localStorage may be unavailable in private or restricted browsers.
    }
  }, [isDark]);

  const toggle = () => setIsDark((current) => !current);

  return (
    <DarkModeContext.Provider value={{ isDark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within DarkModeProvider");
  }
  return context;
}