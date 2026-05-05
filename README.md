# CosPlate - AI-Powered Vibe Coding IDE

CosPlate is a production-ready desktop application designed for "vibe coding" — a fast, AI-assisted development workflow. It features a sandboxed workspace, built-in developer tools, and secure AI integration.

## Features

- **Sandboxed Workspace**: Operates strictly within a selected folder to ensure security.
- **AI Chat**: Integrated Gemini 2.5 Flash-Lite for coding assistance.
- **Built-in Tools**: Code editor, file explorer, terminal, and debug console.
- **Auth System**: Secure login and registration with hashed passwords.
- **Usage Tracking**: Real-time tracking of requests and tokens with strict rate limiting.
- **Custom API Mode**: Option to use your own API key to bypass default limits.
- **Dark Theme**: Clean, professional UI designed for developers.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, SQLite (Better-SQLite3)
- **Desktop Shell**: Electron
- **AI**: Google Generative AI (Gemini)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/boseprahann-arch/CosPlate.git
   ```

2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   PORT=3001
   JWT_SECRET=your_secret_here
   DB_PATH=./database.sqlite
   ```

4. Run the application:
   ```bash
   # Start backend
   node server.js
   
   # Start frontend (in a separate terminal)
   cd frontend && npm run dev
   
   # Start Electron
   npm start
   ```

## Security

- API keys are stored only in the backend `.env`.
- Passwords are hashed using bcrypt.
- Workspace access is restricted to the selected root folder.
- Rate limiting is enforced at the backend level.

## License

MIT
