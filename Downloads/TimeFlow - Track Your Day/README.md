## TimeFlow - Track Your Day
Time Tracking Web Application

A modern, responsive web app that helps users track how they spend their 24 hours each day. Users can log activities, view analytics, visualize time distribution, and analyze daily productivity — all secured with Firebase Authentication
Time Tracking Web Application

Features
🔐 User Authentication

Firebase Email/Password or Google login

Only logged-in users can add, edit, view, or analyze data

Guests see only the login/landing page

📝 Activity Logging

Select any date

Add multiple activities with:

Activity name

Category (Work, Study, Sleep, Exercise, etc.)

Duration (in minutes)

Validation ensures total time ≤ 1440 minutes (24 hrs)

Shows remaining minutes

Edit & delete activities anytime

📊 Analytics Dashboard

For each selected date, the dashboard shows:

Total hours spent

Time spent per category

Count of activities

Visual charts:

Pie Chart

Bar Graph

Optional timeline view

If no activity exists → beautiful “No Data Available” screen

🧠 AI Integration

AI tools used during development for:

UI design suggestions

Color palette ideas

Components & helper functions

Auto-generation of responsive layouts

Documentation support

💻 Responsive UI

Works smoothly on mobile, tablet, and desktop

Uses clean layout, animations, icons, spacing, and modern design principles

🛠️ Tech Stack
Frontend

HTML

CSS

JavaScript (ES6)

Chart.js (for analytics)

Backend

Firebase Authentication

Firebase Firestore / Realtime Database

Deployment

GitHub Pages

📁 Project Structure
/project-root
│── index.html
│── dashboard.html
│── login.html
│── styles.css
│── app.js
│── firebase.js
│── README.md
└── assets/
      └── images/

⚙️ How to Run Locally
1️⃣ Clone the repository
git clone //github.com/Archana10019/TIMEFLOW--TRACK-YOUR-DAY.git
cd your-repo

2️⃣ Open project folder
cd time-tracking-app

3️⃣ Add your Firebase config

In firebase.js:

const firebaseConfig = {
   apiKey: "YOUR_API_KEY",
   authDomain: "YOUR_AUTH_DOMAIN",
   projectId: "YOUR_PROJECT_ID",
   storageBucket: "YOUR_BUCKET",
   messagingSenderId: "YOUR_SENDER_ID",
   appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

4️⃣ Run with Live Server

Use VS Code extension or any static server.

📸 Screenshots (Add after building)
[✔️ Dashboard Screenshot]

[✔️ No Data Available Screen]

[✔️ Activity Logging Screen]

🔮 Future Improvements

Weekly & monthly analytics

Export data as PDF

Dark mode

AI-based activity recommendations

Collaborative/shared tracking mode

🏆 Project Made Using AI Assistance

This project uses AI tools like ChatGPT, Gemini, v0.dev, and Lovable for:

UI brainstorming

Layout generation

Component ideas

Code optimization

Documentation writing