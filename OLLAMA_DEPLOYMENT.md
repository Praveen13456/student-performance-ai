# Free Ollama deployment with Render

The Render backend cannot access Ollama running on a developer's `localhost`.
Run Ollama on a computer that stays online, expose only the Ollama API through
a Cloudflare Tunnel, and configure Render to use the tunnel URL.

## Run the local model

```powershell
ollama serve
```

The currently configured model is:

```text
oamazonasgabriel/lfm2.5-230m:bf16-8gbRAM
```

Verify it locally:

```powershell
curl http://127.0.0.1:11434/api/tags
```

## Create a tunnel

Install `cloudflared`, then run:

```powershell
cloudflared tunnel --url http://127.0.0.1:11434
```

Use the generated HTTPS URL with `/api/chat` appended. For example:

```text
https://example.trycloudflare.com/api/chat
```

The temporary URL changes when the tunnel restarts. A named Cloudflare Tunnel
with an Access service token is safer for a long-running deployment.

For a quick demo, the frontend API URL in `frontend/script.js` can point to a
Cloudflare Tunnel for the local FastAPI server. The computer running FastAPI,
Ollama, and the tunnel must remain online.

## Configure Render

In the Render service environment settings, add:

```text
OLLAMA_URL=https://example.trycloudflare.com/api/chat
OLLAMA_MODEL=oamazonasgabriel/lfm2.5-230m:bf16-8gbRAM
OLLAMA_TIMEOUT_SECONDS=120
```

Redeploy the backend after saving the variables. Do not expose port `11434`
directly and do not put an Ollama API key in frontend JavaScript.

The computer running Ollama and the tunnel must remain powered on and online.
This setup is free for testing and demos, but it is not a reliable 24/7
production deployment.
