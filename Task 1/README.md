# CipherX 🔐

A modern Caesar Cipher encryption/decryption web application built with React, Tailwind CSS v4, Node.js, and Express.

## Project Structure

This project is divided into two parts:
- `client`: The frontend web application (React + Vite + TailwindCSS).
- `server`: The backend REST API (Node.js + Express).

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

## Installation & Setup

### Backend (Server)
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:5000`.

### Frontend (Client)
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

## Features
- **Encrypt/Decrypt Mode:** Easily toggle between encrypting and decrypting messages.
- **Dark/Light Theme:** Toggle modern dark and light modes.
- **Responsive UI:** Clean card layout using Tailwind CSS.
- **Operation History:** Saves your last 5 cipher operations to local storage.
- **Copy to Clipboard:** One-click copy for the results.
- **Keyboard Shortcuts:** Press `Ctrl + Enter` or `Cmd + Enter` to quickly encrypt/decrypt.

## API Endpoints
- `POST /api/encrypt` - Accepts `{ "message": "text", "shift": 3 }` and returns `{ "result": "whaw" }`
- `POST /api/decrypt` - Accepts `{ "message": "whaw", "shift": 3 }` and returns `{ "result": "text" }`
