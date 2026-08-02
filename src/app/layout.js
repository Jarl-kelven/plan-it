import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DarkModeProvider } from "@/lib/darkModeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Plan-It",
  description: "Task management app built with Next.js, Firebase, and Tailwind CSS.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
    <head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const saved = localStorage.getItem('darkMode');
                if (saved && JSON.parse(saved)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })();
          `,
        }}
      />
    </head>
      <body className="min-h-full flex flex-col">
        <DarkModeProvider>
          <Navbar />
          {children}
          <Footer />
        </DarkModeProvider>
      </body>
    </html>
  );
}