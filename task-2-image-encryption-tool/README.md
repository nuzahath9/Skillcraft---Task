# PixelCrypt 🔐 (Task 2)

A visually stunning, highly interactive web-based Image Encryption Tool built with React, Tailwind CSS, Node.js, and Jimp.

## Features

- **Mathematical Transformation**: Encrypts images by modifying the RGB values `(R + key) % 256`. Completely lossless and reversible.
- **Pixel Swapping**: Encrypts images by deterministically reversing pixel rows based on a secret key.
- **Lossless Decryption**: Recovers the exact original image as long as the same method and key are used.
- **Glassmorphism UI**: Beautiful dark futuristic theme with neon glows (Purple & Cyan).
- **Interactive Before/After Slider**: Compare the original and encrypted images side-by-side using a sleek custom drag slider.
- **Drag & Drop Upload**: Smooth file uploading using `react-dropzone`.

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

## Installation & Setup

### 1. Backend (Server)
1. Navigate to the `server` directory:
   ```bash
   cd task-2-image-encryption-tool/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:5001`.

### 2. Frontend (Client)
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd task-2-image-encryption-tool/client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173` (or similar).

## How to Test

1. Open the frontend in your browser.
2. Drag and drop a JPG or PNG image into the upload area.
3. Choose an **Encryption Method** (Math Transform or Pixel Swap).
4. Enter a **Secret Key** (e.g., `1234` or `mySecret`).
5. Click **Encrypt Image**. Wait for the processing to finish.
6. Use the **Before/After slider** on the image to see the encrypted output.
7. Click **Download Result** to save the encrypted image.
8. To decrypt, click **Reset**, upload the *encrypted* image, select the *same method*, enter the *same key*, choose the **Decrypt** tab, and click **Decrypt Image**.
