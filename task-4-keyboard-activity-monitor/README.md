# Keyboard Activity Monitor ⚡

A modern, interactive, and ethical keyboard activity monitoring tool that captures and displays user keystrokes *only* within the application interface, with full user awareness and consent.

## 🎯 Features
- **Real-time Tracking**: Captures key presses only when typing in the designated active area.
- **Virtual Keyboard**: Visualizes your keystrokes and shows a heatmap of frequently used keys.
- **Live Logs**: Displays a log of all captured keystrokes.
- **Session Stats**: Tracks typing speed (WPM), session time, and total keystrokes.
- **Export Options**: Download logs as a `.txt` file or save them to the local server.
- **Modern UI**: Dark mode with neon highlights, glassmorphism design, and smooth animations.

## ⚠️ Important Note
This application is designed for educational and tracking purposes with **full transparency**. It is **not** a keylogger. It only captures keystrokes when the application window is active and the typing area is focused.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd task-4-keyboard-activity-monitor
   ```

2. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Install Server Dependencies:**
   ```bash
   cd ../server
   npm install
   ```

---

## 🏃‍♂️ Running the Project

You need to run both the frontend and backend servers.

### 1. Start the Backend Server
The backend handles saving logs to a local file (`logs/user_logs.txt`).

```bash
cd server
npm run dev
```
*The server will run on `http://localhost:5000`*

### 2. Start the Frontend Client
The frontend is built with React and Vite.

```bash
cd client
npm run dev
```
*The client will run on `http://localhost:5173`*

---

## 🛠 Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS v4, Lucide React (Icons)
- **Backend**: Node.js, Express, fs (File System)

## 📁 Project Structure
```
task-4-keyboard-activity-monitor/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── App.jsx         # Main application logic
│   │   └── index.css       # Tailwind & custom styles
├── server/                 # Node.js backend
│   └── server.js           # Express API endpoints
├── logs/                   # Directory where saved logs are stored
└── README.md
```
