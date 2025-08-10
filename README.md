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

If `AI_GATEWAY_API_KEY` is not set, `obby` will open the Vercel dashboard to create one.

Environment variables:

- `AI_GATEWAY_API_KEY` (required)
- `AI_GATEWAY_MODEL` (optional, default: `openai/gpt-5`)

Options:

- `-m, --model` — Specify AI model (default: `openai/gpt-5`)
- `-h, --help` — Show help message

Get an API Key: https://vercel.com/ai-gateway

## Author
[eersnington](https://x.com/eersnington)
[Obby](https://obby.dev)


