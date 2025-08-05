Messenger App
A real-time messenger application built with React and Next.js focused on secure communication, modern UI, and efficient message handling. The app implements robust authentication, advanced styling, and end-to-end encryption leveraging protocols like Signal and NaCl. Docker is supported for seamless deployment with WSL2 compatibility.

Features
⚡️ Real-time messaging.

🔒 End-to-end encryption (Signal Protocol/NaCl based).

👤 User authentication & role-based access.

🎨 Responsive, modern UI with advanced styling.

🔍 Message filtering and sorting.

🐳 Dockerized for deployment (WSL2 compatible).

Getting Started
Prerequisites
Node.js (v14+)

Yarn or npm

Docker Desktop (optional, for containerized deployment)

WSL2 for Windows (if running Docker Desktop)

Installation
bash
git clone https://github.com/your-username/messenger-app.git
cd messenger-app
npm install
Development
bash
npm run dev
Access the app at http://localhost:3000.

Docker Deployment
bash
docker build -t messenger-app .
docker run -p 3000:3000 messenger-app
Environment Variables
Create a .env.local file and configure (example):

text
NEXT_PUBLIC_API_URL=http://localhost:3000/api
ENCRYPTION_KEY=your-secret-key
Usage
Register or sign in.

Start secure chats with contacts.

Messages are encrypted and decrypted client-side.

Use search & filters to manage conversation history.

Tech Stack
React

Next.js

JavaScript (ES6+)

Signal Protocol / NaCl (encryption)

Docker (for deployment)

WSL2 (optional, for container support)
