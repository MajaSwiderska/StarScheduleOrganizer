<img width="1913" height="912" alt="Screenshot 2026-05-27 104020" src="https://github.com/user-attachments/assets/0cc1ba34-d20e-43ed-bd63-5e1ce1b924c0" />
# 📅 Star Schedule Organizer

A beautiful, full-stack schedule management application with authentication, priority tracking, and progress monitoring. Built with React, TypeScript, Supabase, and Deno.

## 📸 Screenshots

### Login Page
<img width="1913" height="912" alt="Screenshot 2026-05-27 104020" src="https://github.com/user-attachments/assets/a61d0647-258d-4027-adc1-abea2eece6bb" />

### Dashboard
<img width="1911" height="912" alt="Screenshot 2026-05-27 104054" src="https://github.com/user-attachments/assets/19f8262d-c881-4de9-af39-b585069cc766" />

## ✨ Features

- 🔐 **User Authentication** - Sign up and login with email/password
- 📝 **Create & Manage Schedules** - Add, edit, and delete your schedules
- 🎯 **Priority Levels** - Mark schedules as Low, Medium, or High priority
- 📊 **Progress Tracking** - Track completion progress from 0% to 100%
- 📈 **Analytics Dashboard** - View statistics and progress reports
- ⭐ **Animated Background** - Beautiful animated star background
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components

## 🚀 Live Demo

Visit the live application: [https://MajaSwiderska.github.io/StarScheduleOrganizer](https://MajaSwiderska.github.io/StarScheduleOrganizer)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Vite** - Build tool
- **Lucide React** - Icons

### Backend
- **Supabase** - Authentication & Database
- **Deno** - Server runtime
- **Hono** - Web framework
- **KV Store** - Data persistence

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- Deno (for backend)

### Clone the repository
git clone https://github.com/MajaSwiderska/StarScheduleOrganizer.git
cd StarScheduleOrganizer
Install dependencies
bash
npm install

# Environment Variables
Create a .env file in the root directory:
env file:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run the development server
npm run dev
The app will open at http://localhost:5173

🏗️ Project Structure
text
StarScheduleOrganizer/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ScheduleOrganizer.tsx    # Main schedule component
│   │   │   ├── Stars.tsx                 # Animated background
│   │   │   └── ui/                       # shadcn/ui components
│   │   └── App.tsx                       # Main app component
│   ├── utils/
│   │   ├── api.ts                        # API calls
│   │   └── supabase.ts                   # Supabase client
│   ├── config/
│   │   └── supabase.ts                   # Supabase configuration
│   └── styles/                           # CSS styles
├── supabase/
│   └── functions/
│       └── server/                       # Deno backend
├── index.html
├── package.json
└── README.md

# 🎯 Usage
Sign Up
Click "Sign up" on the login page

Enter your name, email, and password

Click "Create Account"

Create a Schedule
Click the "New Schedule" button

Fill in the title, description, dates, and priority

Click "Create"

Edit a Schedule
Click the edit icon (pencil) on any schedule card

Update the information

Adjust the progress slider (for existing schedules)

Click "Update"

Delete a Schedule
Click the delete icon (trash can) on any schedule card

Confirm deletion

View Statistics
The right sidebar shows:

Overall progress percentage

Total schedules count

Completed vs in-progress counts

Priority breakdown

# 🚢 Deployment
Deploy to GitHub Pages (Frontend only)
bash
npm run build
npm run deploy
Then enable GitHub Pages in your repository settings, selecting the gh-pages branch.

Deploy Backend to Deno Deploy
Push your code to GitHub

Connect your repository to Deno Deploy

Set the entry point to supabase/functions/server/index.ts

Add environment variables:

SUPABASE_URL

SUPABASE_SERVICE_ROLE_KEY

Deploy to Vercel (Full Stack)
https://vercel.com/button

# 📝 API Endpoints
The backend provides the following endpoints:

Method	Endpoint	Description
POST	/make-server-e8fe712f/signup	Create new user
GET	/make-server-e8fe712f/schedules	Get all schedules
POST	/make-server-e8fe712f/schedules	Create new schedule
PUT	/make-server-e8fe712f/schedules/:id	Update schedule
DELETE	/make-server-e8fe712f/schedules/:id	Delete schedule

# 🎨 Color Scheme
Primary Gradient: #667eea to #764ba2 (Purple gradient)
Priority Colors:
High: Red
Medium: Yellow
Low: Green
Progress Indicators: Gradient from green to red

# 🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📧 Contact
Maja Swiderska - GitHub

Project Link: https://github.com/MajaSwiderska/StarScheduleOrganizer

# ⭐ Show your support
Give a ⭐️ if this project helped you!

Known Issues:
- The backend needs to be deployed separately for full functionality
- GitHub Pages only hosts the frontend (static files)
- Sign up/login requires a running backend server

