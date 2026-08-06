# 🎯 PlanIt - Task Management App

A modern, feature-rich task management application built with Next.js, Firebase, and Tailwind CSS.

## 🌟 Features

- ✅ **Real-time Task Management** - Create, edit, delete tasks instantly
- ✅ **Smart Filtering** - Filter by status, priority, category, and search
- ✅ **Dark Mode** - Toggle between light and dark themes with persistence
- ✅ **Analytics Dashboard** - Track your productivity with completion rates
- ✅ **Due Date Tracking** - Visual indicators for overdue and upcoming tasks
- ✅ **Bulk Actions** - Mark multiple tasks as done at once
- ✅ **CSV Export** - Download your tasks for analysis
- ✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ✅ **Authentication** - Secure Google Sign-in with Firebase
- ✅ **Loading States** - Beautiful skeleton loaders for better UX

## 🚀 Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Firebase (Firestore, Authentication)
- **Hosting:** Vercel
- **Notifications:** Custom toast system

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/planit.git
cd planit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

🔐 Environment Variables
Create .env.local:

text

NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id


🎨 Features in Detail

Task Management
Create tasks with title, description, priority, category, and due date
Edit tasks inline
Delete tasks with confirmation
Change status with dropdown
Filtering & Search
Search by title or description
Filter by priority (Low, Medium, High)
Filter by status (To Do, In Progress, Done)
Filter by category
Dynamic category dropdown
Analytics
Total tasks count
Completed tasks count
In-progress tasks count
Completion rate with progress bar
Dark Mode
Toggle between light and dark themes
Persists across sessions
Smooth transitions


📱 Screenshots
[Add screenshots here]

🚢 Deployment
Deployed on Vercel: https://plan-it-bay-zeta.vercel.app

📝 License
MIT License - feel free to use this project however you want!

👨‍💻 Author
Jarl Kelven

