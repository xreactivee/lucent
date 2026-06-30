# ✨ Lucent

<p align="center">
  <img src="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>✨</text></svg>" width="80" height="80" alt="Lucent Logo" />
</p>

<p align="center">
  <strong>An elegant, 100% browser-based, AI-powered background remover.</strong>
</p>

<p align="center">
  No servers, no sign-ups, and no tracking. 100% private, free, and unlimited HD downloads.
</p>

<p align="center">
  <a href="https://lucent-fawn.vercel.app"><strong>Live Demo »</strong></a>
</p>

---

## 🌟 Key Features

*   🔒 **Privacy-First (100% Local):** Your images never leave your computer. All AI processing is performed locally inside your browser using WebAssembly.
*   ⚡ **No Limits or Fees:** No subscriptions, credit systems, or sign-ups. Process as many images as you need without any restrictions.
*   🏆 **HD Quality Downloads:** Unlike other background removers, Lucent does not charge for high-resolution downloads. Get your images in full original resolution for free.
*   🎨 **Themeable Backdrops:** Customize your background with transparent checkerboard, solid colors, custom background images, or gorgeous pre-set gradients (fully supported in HD exports).
*   🔄 **Before/After Comparison:** An interactive, touch-friendly slider to compare the original and processed images side by side.
*   📋 **Session History:** Keeps track of your recently processed images during your active session so you can quickly switch back and edit them.
*   📋 **Clipboard Support (Ctrl+V):** Paste images directly from your clipboard to start processing instantly.

---

## 🛠️ Tech Stack

*   **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite 8](https://vite.dev/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (using the new native Vite plugin)
*   **AI Engine:** [@imgly/background-removal](https://github.com/imgly/background-removal-js) (WASM-based ONNX Runtime)
*   **Icons:** [Lucide React](https://lucide.dev/)

---

## 🧠 How It Works

Lucent leverages **WebAssembly (WASM)** and **ONNX Runtime Web** to run deep learning models directly inside the browser's web worker threads.

> [!NOTE]
> **First-Run Loading:**
> When you process your first image, the application downloads the AI model (~30MB) and stores it in your browser's local cache. This download happens only once. Subsequent images are processed completely offline and instantaneously.

---

## 💻 Local Setup & Development

To run Lucent locally on your machine, follow these steps:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/xreactivee/lucent.git
    cd lucent
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the local development server:**
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

---

## 🚀 Deployment

Lucent is ready to be deployed to any static hosting provider (Vercel, Netlify, GitHub Pages, etc.).

### Deploying to Vercel

You can deploy the project instantly using the Vercel CLI:

```bash
# Install Vercel CLI if you haven't already
npm install -g vercel

# Deploy to production
vercel --prod
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
