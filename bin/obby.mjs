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

Env:
  AI_GATEWAY_API_KEY   Your Vercel AI Gateway API key (required)
  AI_GATEWAY_MODEL     Model id like 'openai/gpt-5' (default)
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
	if (args.length === 0 || ["-h", "--help"].includes(args[0])) {
		printHelp();
		process.exit(0);
	}

	const prompt = args.join(" ").trim();
	if (!prompt) {
		printHelp();
		process.exit(1);
	}

	const apiKey = await ensureApiKey();

	process.env.AI_GATEWAY_API_KEY = apiKey;

	const modelId = process.env.AI_GATEWAY_MODEL || "openai/gpt-5";

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
