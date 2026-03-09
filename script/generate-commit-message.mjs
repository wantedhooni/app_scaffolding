#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [, , messageFile, source = ""] = process.argv;

if (!messageFile) {
  process.exit(0);
}

if (["message", "merge", "squash", "commit"].includes(source)) {
  process.exit(0);
}

if (!existsSync(messageFile)) {
  writeFileSync(messageFile, "", "utf8");
}

const currentMessage = readFileSync(messageFile, "utf8");
if (currentMessage.trim().length > 0) {
  process.exit(0);
}

const rootDir = execGit(["rev-parse", "--show-toplevel"]);
loadDotEnv(path.join(rootDir, ".env"));

const stagedFiles = execGit(["diff", "--cached", "--name-only"])
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

if (stagedFiles.length === 0) {
  process.exit(0);
}

const statSummary = execGit(["diff", "--cached", "--stat"]);
const diffSummary = execGit(["diff", "--cached", "--unified=0", "--no-color"]);

const generated = await generateCommitMessage({
  stagedFiles,
  statSummary,
  diffSummary,
});

writeFileSync(messageFile, `${generated}\n`, "utf8");
console.error(`[ai-commit-msg] ${generated}`);

function execGit(args) {
  return execFileSync("git", args, { cwd: rootDirSafe(), encoding: "utf8" }).trim();
}

function rootDirSafe() {
  return process.cwd();
}

function loadDotEnv(envFile) {
  if (!existsSync(envFile)) {
    return;
  }

  const content = readFileSync(envFile, "utf8");
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    process.env[key] = value;
  }
}

async function generateCommitMessage({ stagedFiles, statSummary, diffSummary }) {
  const host = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2";
  const prompt = [
    "Generate one git commit subject line.",
    "Return only the commit subject line.",
    "Use conventional commits format: type(scope): summary or type: summary.",
    "Write the subject in Korean.",
    "Keep it under 72 characters.",
    "Be specific to the staged changes.",
    "Do not use backticks, quotes, markdown, or bullet points.",
    "",
    "Staged files:",
    stagedFiles.join("\n"),
    "",
    "Diff stat:",
    statSummary || "(none)",
    "",
    "Patch excerpt:",
    truncate(diffSummary, 12000),
  ].join("\n");

  try {
    const response = await fetch(`${host}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        system: [
          "You are a senior software engineer generating git commit messages.",
          "Return exactly one line.",
          "Use conventional commits format.",
          "Write the subject in Korean.",
          "No explanation.",
        ].join("\n"),
        prompt,
        stream: false,
        options: {
          temperature: 0.2,
          top_p: 0.9,
          num_predict: 80,
          stop: ["\n"],
        },
      }),
    });

    if (!response.ok) {
      return fallbackMessage(stagedFiles);
    }

    const data = await response.json();
    const text = extractOllamaText(data).trim();

    if (!text) {
      return fallbackMessage(stagedFiles);
    }

    return sanitizeCommitMessage(text);
  } catch {
    return fallbackMessage(stagedFiles);
  }
}

function extractOllamaText(data) {
  if (typeof data.response === "string" && data.response.trim()) {
    return data.response;
  }
  return "";
}

function sanitizeCommitMessage(value) {
  return truncate(
    value
      .split("\n")[0]
      .replace(/^['"`\s]+|['"`\s]+$/g, "")
      .replace(/\.$/, ""),
    72
  );
}

function fallbackMessage(stagedFiles) {
  const first = stagedFiles[0] || "changes";
  const scope = first.split("/")[0];
  if (stagedFiles.length === 1) {
    return sanitizeCommitMessage(`chore(${scope}): update ${first}`);
  }
  return sanitizeCommitMessage(`chore(${scope}): update ${stagedFiles.length} staged files`);
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 3)}...`;
}
