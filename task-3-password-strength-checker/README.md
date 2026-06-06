# Password Strength Checker (Task 3)

A powerful, modern, and highly interactive Password Strength Checker built with React.js (Vite) and Node.js.

## 🚀 Features
- **Real-time Evaluation**: Provides instant feedback on password strength.
- **Detailed Criteria Checking**: Checks for length, uppercase, lowercase, numbers, and special characters.
- **Visual Strength Meter**: Dynamic color-coded progress bar (Very Weak to Very Strong).
- **Suggestions & Improvements**: Explains what is missing to make the password stronger.
- **Password Generator**: One-click strong random password generation.
- **History Tracking**: Keeps track of the last 5 checked passwords.
- **Copy to Clipboard**: Quick copy feature with visual feedback.
- **Glassmorphism UI**: Beautiful, dark-themed UI with neon accents using Tailwind CSS.
- **Backend Validation**: Server-side password validation API using Node.js & Express.

## 📁 Project Structure

```text
task-3-password-strength-checker/
│
├── client/                 # React.js (Vite) Frontend
│   ├── src/
│   │   ├── components/     # UI Components (PasswordChecker.jsx)
│   │   ├── App.jsx         # Main App Component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Tailwind & Global Styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js + Express Backend
│   ├── controllers/        # Request handlers
│   ├── routes/             # API routes
│   ├── utils/              # Password evaluation logic
│   ├── server.js           # Express App Entry
│   └── package.json
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Clone or Download the Repository

### 2. Setup the Backend (Node.js API)
1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd task-3-password-strength-checker/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000`*

### 3. Setup the Frontend (React.js)
1. Open a **new** terminal and navigate to the `client` folder:
   ```bash
   cd task-3-password-strength-checker/client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The client will run on `http://localhost:5173`*

## 🧪 Testing Passwords

Try these sample passwords to see different strength levels:
- `12345` ➔ **Very Weak** 🔴 (Fails length and complexity)
- `password` ➔ **Weak** 🟠 (Fails complexity)
- `Pass123` ➔ **Medium** 🟡 (Fails length and special char)
- `P@ssw0rd123!` ➔ **Very Strong** 🔥 (Passes all criteria)

## 💡 Technologies Used
- **Frontend**: React.js, Vite, Tailwind CSS v4, Framer Motion, Lucide React, Axios
- **Backend**: Node.js, Express, Cors
