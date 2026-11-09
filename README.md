# Agent 47 — Eve Agent with OpenRouter

This project is an **Eve** agent configured to use **OpenRouter** and instructed to greet users warmly.

## Quickstart

### 1. Configure your OpenRouter API Key

Create a `.env` file (or copy `env.example` to `.env`):

```bash
cp env.example .env
```

Open `.env` and provide your OpenRouter API key:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

*(Optional)* You can also set a custom model via `OPENROUTER_MODEL` (defaults to `meta-llama/llama-3.3-70b-instruct`). Examples:
- `anthropic/claude-3.5-sonnet`
- `google/gemini-2.0-flash-001`
- `meta-llama/llama-3.3-70b-instruct`

### 2. Start the Agent in Development Mode

Run the Eve Dev TUI:

```bash
npm run dev
# or: npx eve dev
```

Eve will load your instructions and runtime configuration from `agent/`, start the interactive terminal session, and greet you.
