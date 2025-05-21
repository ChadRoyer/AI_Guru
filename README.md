# AI_Guru

AI_Guru is an experimental Next.js application that interacts with OpenAI models to generate diagrams from chat messages. Users chat with the assistant and the app streams diagram updates in real time.

## Prerequisites

- **Node.js**: v18 or later is recommended.
- **Environment variables**:
  - Copy `.env.example` to `.env` and fill in the required values.
  - `OPENAI_API_KEY` – your OpenAI API key used by the `/api/ai` route.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Build / Deployment

To create a production build, run:
```bash
npm run build
```
Then start the production server with:
```bash
npm start
```
This project can also be deployed to platforms that support Next.js applications (e.g. Vercel).
