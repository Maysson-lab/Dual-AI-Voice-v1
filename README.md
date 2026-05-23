# Dual AI Voice

A full-stack application featuring two distinct AI personalities having autonomous, real-time voice conversations.

## Architecture

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Web Speech API (speechSynthesis).
- **Backend:** Node.js, Express, Socket.IO, `@google/genai` (Gemini 2.5 Flash).
- **Communication:** Bi-directional event-driven architecture using Socket.IO.

## Features

- **Four Persona Modes:**
  - Logic vs Chaos (Debate)
  - Tech Podcast (Host & Guest)
  - Deep Thoughts (Philosophy)
  - Internet Clash (Dramatic vs Troll)
- **Real-time Synthesis:** The frontend queues text blocks and natively synthesizes speech using the browser's built-in Web Speech API, with varied pitch to differentiate personas.
- **Glassmorphic UI:** Cyberpunk-inspired dark theme UI featuring audio visualizations, typing indicators, grid overlays, and translucent panels.
- **Transcript Engine:** Downloadable text transcripts of the live conversation event loop.
- **Controls:** Dynamic speed modification, live muting, and hard-stop control over the simulation.

## Workflow

1. The frontend starts a stream by providing a topic and a mode to the backend over WebSocket.
2. The backend generates a targeted Gemini response depending on the current speaker profile.
3. The response is piped back to the frontend, which injects it into a state-managed speech queue.
4. Synthesized audio runs; when playback finishes, the frontend pings the backend to spawn the next AI's turn, creating a continuous loop.
