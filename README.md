## obby-cli

Talk to AI from your terminal via Vercel AI Gateway.

### Install

```bash
npm i -g obby-cli
```

### Usage

```bash
obby "hey, what's up"
obby hello
echo "explain this code" | obby
obby -m openai/gpt-oss-120b "who is rauchg"
```

If `AI_GATEWAY_API_KEY` is not set, `obby` will open the Vercel dashboard and you should create one.

Environment variables:

- `AI_GATEWAY_API_KEY` (required)
- `AI_GATEWAY_MODEL` (optional, default: `openai/gpt-5`)

Options:

- `-m, --model` — Specify AI model (default: `openai/gpt-5`)
- `-h, --help` — Show help message

Get an API Key: [AI Gateway](https://vercel.com/ai-gateway)

### Configure API key

- macOS/Linux (zsh):
  ```bash
  echo 'export AI_GATEWAY_API_KEY="YOUR_KEY"' >> ~/.zshrc
  source ~/.zshrc
  ```
- macOS/Linux (bash):
  ```bash
  echo 'export AI_GATEWAY_API_KEY="YOUR_KEY"' >> ~/.bashrc
  source ~/.bashrc
  ```
- fish:
  ```bash
  set -Ux AI_GATEWAY_API_KEY YOUR_KEY
  ```
- Windows (PowerShell):
  ```powershell
  setx AI_GATEWAY_API_KEY "YOUR_KEY"
  # open a new terminal for it to take effect
  ```

Verify:
```bash
obby "cowsay what"
```

## Author
[eersnington](https://x.com/eersnington)
[Obby](https://obby.dev)


