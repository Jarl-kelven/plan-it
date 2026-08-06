import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-sky-100 to-indigo-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-40">
          <div className="absolute -left-20 top-8 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-500/20" />
          <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl dark:bg-violet-500/20" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-[32px] border border-white/80 bg-white/90 p-12 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/90">
            <p className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-slate-800 dark:text-sky-300 mb-6">
              Build habits, ship tasks, and stay focused
            </p>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-slate-100">
              Welcome to PlanIt
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10">
              A beautiful, real-time task management app that helps you stay organized and productive.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/tasks"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
              >
                Get Started
              </Link>
              <Link
                href="https://github.com/jarl-kelven/planit"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "✅", title: "Real-time Updates", desc: "See changes instantly across all devices" },
              { icon: "🎨", title: "Dark Mode", desc: "Easy on the eyes, any time of day" },
              { icon: "📊", title: "Analytics", desc: "Track your productivity with detailed stats" },
              { icon: "🔍", title: "Smart Search", desc: "Find tasks instantly with powerful filters" },
              { icon: "📥", title: "Export Data", desc: "Download your tasks as CSV anytime" },
              { icon: "🔐", title: "Secure", desc: "Firebase authentication keeps you safe" },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to get organized?</h2>
          <Link
            href="/tasks"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold inline-block"
          >
            Start Using PlanIt Now
          </Link>
        </div>
      </section>
    </div>
  );
}