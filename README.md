<div align="center">

# 🤖 Fayssal's AI Chatbot

A sleek, ultra-fast, and minimal AI Chat application powered by the latest **Llama 3.2 11B** via NVIDIA NIM. Built with pure Node.js, Express, and a stunning glassmorphism UI.

![UI Sneak Peek](https://img.shields.io/badge/UI-Glassmorphism-10a37f?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20Vanilla%20JS-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

<br>

## ✨ Features

- **Blazing Fast Responses:** Native Server-Sent Events (SSE) streaming delivering words instantly as the AI "types".
- **Modern UI/UX:** Clean, dark-mode-first interface using CSS Glassmorphism, smooth animations, and a seamless chat experience.
- **Code Highlighting:** Automatically detects and formats code blocks using `highlight.js` with easy "Copy Code" buttons.
- **Markdown Support:** Full markdown rendering (bold, italics, lists, tables, etc.) for beautiful and structured AI responses.
- **Chat History:** Lightweight sidebar saving recent conversations in your browser's session.
- **Llama 3.2 Vision-Ready Framework:** Easily adaptable, scalable, and built primarily on Meta's robust 11B model via NVIDIA NIM.
- **Serverless Ready:** Pre-configured `vercel.json` ensures a perfect 0-config deployment to Vercel.

---

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, Vanilla JavaScript, Vanilla CSS (No heavy frameworks!)
- **Libraries:**
  - `highlight.js` (Code syntax highlighting)
  - `marked.js` (Markdown parsing)
- **AI Provider:** NVIDIA NIM API (`meta/llama-3.2-11b-vision-instruct`)

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18.x or 20.x recommended)
- An active API Key from [NVIDIA Build](https://build.nvidia.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/mon-chatbot.git
   cd mon-chatbot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your NVIDIA API key:

   ```env
   NVIDIA_API_KEY=your_nvidia_api_key_here
   PORT=3000
   ```

4. **Run the application:**
   For standard start:

   ```bash
   npm start
   ```

   For development (auto-restart on changes):

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

---

## ☁️ Deployment

### Deploying to Vercel (Recommended)

This project has been specifically optimized for a one-click deployment to Vercel.

1. Ensure your code is pushed to your GitHub repository.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Open the **"Environment Variables"** dropdown and add:
   - `NVIDIA_API_KEY`: _(your actual API key)_
5. Click **Deploy**.

Vercel will automatically detect `vercel.json` and host your AI Chatbot as a serverless function!

---

## 🐋 Docker Deployment (VPS / Self-hosted)

If you prefer to host it yourself, a `Dockerfile` is provided.

```bash
# Build the image
docker build -t personnal-chatbot .

# Run the container
docker run -d -p 3000:3000 -e NVIDIA_API_KEY="your_api_key_here" personnal-chatbot
```

---

## 👨‍💻 Author

**Réalisé par Fayssal Outlahyante**

_Building the future of AI interfaces, one elegant UI at a time._
