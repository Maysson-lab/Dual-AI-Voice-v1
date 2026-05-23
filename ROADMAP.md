# Dual AI Voice - Roadmap

This document outlines the current state, upcoming features, and long-term vision for the **Dual AI Voice** application.

## Phase 1: Foundation (Current State)
- [x] Full-stack architecture (React/Vite Frontend, Node.js/Express Backend).
- [x] Real-time event-driven communication via Socket.io.
- [x] Integration with Gemini API for dynamic, contextual AI conversation generation.
- [x] In-browser Web Speech API implementation for text-to-speech synthesis.
- [x] Professional, cyberpunk-inspired "Glassmorphism" UI with neon accents.
- [x] Four core AI persona modes (Debate, Podcast, Philosophy, Chat).
- [x] Transcript export capability (.txt).
- [x] Basic audio visualizer and typing indicators.

## Phase 2: Enhanced Audio & Interaction (Short-term)
- [ ] **Advanced Voice Synthesis**: Migrate from the browser's native Web Speech API to a premium cloud TTS provider (e.g., ElevenLabs or Google Cloud TTS) for hyper-realistic, distinct voices.
- [ ] **User Interruptions**: Allow users to inject prompts or steer the conversation while the AIs are speaking.
- [ ] **Token Streaming**: Implement Gemini API text streaming (Server-Sent Events) to reduce latency between turns.
- [ ] **Configurable Conversation Limits**: Add settings to control the maximum number of turns or time limits before automatic termination.

## Phase 3: Visual & Social Features (Mid-term)
- [ ] **3D Avatars**: Integrate `react-three-fiber` to render 3D avatars that lip-sync based on audio frequency data.
- [ ] **Dynamic Theming**: Adjust UI colors, particle effects, and background gradients dynamically based on the sentiment/emotion of the ongoing conversation.
- [ ] **Custom Persona Builder**: Allow users to write their own system prompts and configure custom personality traits for AI 1 and AI 2.
- [ ] **Session Sharing**: Implement a database (e.g., Firestore) to save transcripts and generate shareable links to replay specific debates.

## Phase 4: Scale & Production (Long-term)
- [ ] **Native WebRTC Audio**: Move audio generation entirely to the backend and stream raw audio buffers via WebRTC for zero-latency, high-fidelity playback.
- [ ] **Multiplayer Spectating**: Create spectator rooms where multiple human users can join, listen, and vote on which AI is winning the debate in real-time.
- [ ] **Mobile Optimization**: Progressive Web App (PWA) manifesting and native audio-handling optimizations for iOS/Android browsers.
- [ ] **API Access**: Provide a developer API to trigger automated AI debates and receive audio streams programmatically.
