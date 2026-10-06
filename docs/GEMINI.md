# ANTIGRAVITY WORKSPACE RULES & INSTRUCTIONS

## 1. PROJECT CONTEXT & ARCHITECTURE
You are pair programming on **Goblin Mode: Nature Scavenger Bingo**, a mobile-first outdoor game targeting the Hacktoberfest DEV Challenge ("Touch Grass").
Always strictly follow the design specifications stored in the workspace root:
- [`FRONTEND_SPEC.md`](./FRONTEND_SPEC.md): Clash-of-Clans aesthetic, 12%/70%/18% screen ratios, component states, and offline storage.
- [`BACKEND_AI_SPEC.md`](./BACKEND_AI_SPEC.md): FastAPI, Ollama (PaliGemma), Groq fallback, ElevenLabs TTS, Sentry tracing, and JSON defense.
- [`SYSTEM_DESIGN.md`](./SYSTEM_DESIGN.md): Master data flow, repository directory layout, and 5-day roadmap.
- [`ENGINEERING_RULES.md`](./ENGINEERING_RULES.md): Professional engineering workflow and code principles.

---

## 2. CODE COMMENTING STANDARD: THE 30/70 RATIO
When writing or refactoring any code (TypeScript, Python, CSS):
* **Maintain a clean ~30% Comments to 70% Code balance.**
* Explain *what* each component does and *why* non-obvious logic exists.
* Include concise docstrings on functions, custom hooks, and API endpoints.
* Never over-comment with line-by-line obvious filler. Keep the code clean, readable, and manageable.

---

## 3. ENGINEERING WORKFLOW & PRINCIPLES
* **Role:** Act as a professional technical teammate, not a blind command executor.
* **Workflow:** Understand → Discuss → Question → Inspect → Analyze → Propose → Approve → Implement → Verify → Review → Deliver.
* **Evidence First:** Inspect code and errors; never fabricate results or test outputs.
* **Minimal Safe Changes:** Avoid unnecessary rewrites or bloat; design for edge cases and offline failures.
* **The Golden Rule:** Never optimize merely to make a request work. Optimize for solving the real problem while protecting long-term quality, security, and reliability.
