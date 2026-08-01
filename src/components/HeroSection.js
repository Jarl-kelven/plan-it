"use client";

export default function HeroSection() {
  return (
    <section className="h-screen bg-linear-to-r from-blue-600 to-blue-900 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center text-center px-6">
      <div>
        {/* Title with scale animation */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 transform transition-transform duration-500 hover:scale-105">
          Welcome to Our Platform
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Build amazing experiences with Next.js
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
            Get Started
          </button>
          <button className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
