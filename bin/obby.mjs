#!/usr/bin/env node

import process from "node:process";
import { gateway } from "@ai-sdk/gateway";
import { streamText } from "ai";
import openUrl from "open";

const KEY_URL =
	"https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys%3Futm_source%3Dai_gateway_landing_page&title=Get+an+API+Key";

function printHelp() {
	console.log(`
obby - talk to AI from your terminal via Vercel AI Gateway

Usage:
  obby "your prompt here"
  obby hello
  echo "explain this code" | obby
  obby -m openai/gpt-oss-120b "who is rauchg"

Env:
  AI_GATEWAY_API_KEY   Your Vercel AI Gateway API key (required)
  AI_GATEWAY_MODEL     Model id like 'openai/gpt-5' (default)

Options:
  -m, --model          Specify AI model (default: openai/gpt-5)
  -h, --help           Show help message

Get an API Key: ${KEY_URL}
`);
}

async function ensureApiKey() {
	const apiKey = process.env.AI_GATEWAY_API_KEY?.trim();
	if (apiKey) return apiKey;
	console.error(
		"AI_GATEWAY_API_KEY is not set. Opening Vercel to create one...",
	);
	try {
		await openUrl(KEY_URL);
	} catch {}
	process.exitCode = 1;
	process.exit(1);
}

async function main() {
	const args = process.argv.slice(2);
	let requestedModel = undefined;
	const positional = [];
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === "-h" || arg === "--help") {
			printHelp();
			process.exit(0);
		}
		if (arg === "-m" || arg === "--model") {
			const next = args[i + 1];
			if (!next) {
				console.error("Missing value for -m/--model");
				process.exit(1);
			}
			requestedModel = next;
			i += 1;
			continue;
		}
		if (arg.startsWith("--model=")) {
			requestedModel = arg.split("=")[1];
			continue;
		}
		if (arg.startsWith("-m=")) {
			requestedModel = arg.split("=")[1];
			continue;
		}
		positional.push(arg);
	}

	let prompt = positional.join(" ").trim();
	if (!prompt) {
		if (!process.stdin.isTTY) {
			prompt = await new Promise((resolve) => {
				let data = "";
				process.stdin.setEncoding("utf8");
				process.stdin.on("data", (chunk) => (data += chunk));
				process.stdin.on("end", () => resolve(data.trim()));
			});
		}
	}
	if (!prompt) {
		printHelp();
		process.exit(1);
	}

	const apiKey = await ensureApiKey();

	process.env.AI_GATEWAY_API_KEY = apiKey;

	const modelId =
		requestedModel || process.env.AI_GATEWAY_MODEL || "openai/gpt-5";

	try {
		const { textStream } = await streamText({
			model: gateway(modelId),
			prompt,
		});

		for await (const chunk of textStream) {
			process.stdout.write(chunk);
		}
		process.stdout.write("\n");
	} catch (err) {
		console.error("Failed to get response:", err?.message || err);
		process.exit(1);
	}
}

main();
