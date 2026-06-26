import fs from "node:fs";
import path from "node:path";

import { BLOG_ARCHIVE, blogs } from "../data/blogs.js";
import { procedures } from "../data/procedures.js";
import { treatments } from "../data/treatments.js";
import { HOME_DYNAMIC_STRINGS } from "../lib/home-dynamic-strings.js";
import { UI_STRINGS, TARGET_LOCALES } from "../lib/i18n-config.js";
import {
  collectTranslatableStrings,
  getMissingTranslations,
  getTranslationKey,
  loadTranslationMemory,
  rememberEnglish,
  saveTranslationMemory,
} from "../lib/translation-memory.server.js";

function loadDotEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);

  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [rawKey, ...rawValueParts] = trimmed.split("=");
    const key = rawKey.trim();
    const value = rawValueParts.join("=").trim().replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDotEnvFile(".env.local");
loadDotEnvFile(".env");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_TRANSLATION_MODEL || process.env.GEMINI_MODEL || "gemini-2.5-flash";
const BATCH_SIZE = Number(process.env.TRANSLATION_BATCH_SIZE || 60);
const DRY_RUN = process.argv.includes("--dry-run");
const scopeArg = process.argv.find((arg) => arg.startsWith("--scope="));
const requestedScopes = new Set(
  (scopeArg?.replace("--scope=", "") || process.env.TRANSLATION_SCOPE || "all")
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean)
);

const LEGACY_FILE_SCOPES = {
  home: "index.html",
  about: "about.html",
  contact: "contact-us.html",
  exercise: "exercise.html",
};

function includesScope(scope) {
  return requestedScopes.has("all") || requestedScopes.has(scope);
}

function readLegacyBody(relativePath) {
  const filePath = path.join(process.cwd(), "content", "legacy-site", relativePath);
  const html = fs.readFileSync(filePath, "utf8");
  const bodyMatch = html.match(/<body>([\s\S]*?)<script src="script\.js"><\/script>/);
  return bodyMatch ? bodyMatch[1] : "";
}

function collectLegacyHtmlStrings(markup, memory, collector) {
  const withoutScripts = markup.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");

  for (const match of withoutScripts.matchAll(/>([^<>]+)</g)) {
    collectTranslatableStrings(match[1], memory, collector);
  }

  for (const match of withoutScripts.matchAll(/\s(?:alt|title|placeholder|aria-label|value|content)="([^"]+)"/g)) {
    collectTranslatableStrings(match[1], memory, collector);
  }
}

function buildTranslationSources(memory) {
  const sources = [];

  if (includesScope("shared-ui")) {
    sources.push({ name: "shared-ui", value: UI_STRINGS });
  }

  if (includesScope("blog")) {
    sources.push({ name: "blog-archive", value: BLOG_ARCHIVE });
    sources.push({ name: "blogs", value: blogs });
  }

  if (includesScope("treatments")) {
    sources.push({ name: "treatments", value: treatments });
  }

  if (includesScope("procedures")) {
    sources.push({ name: "procedures", value: procedures });
  }

  for (const [scope, file] of Object.entries(LEGACY_FILE_SCOPES)) {
    if (!includesScope(scope)) {
      continue;
    }

    const collector = new Set();
    collectLegacyHtmlStrings(readLegacyBody(file), memory, collector);
    if (scope === "home") {
      collectTranslatableStrings(HOME_DYNAMIC_STRINGS, memory, collector);
    }
    sources.push({ name: `legacy:${file}`, strings: collector });
  }

  return sources;
}

function chunk(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function parseGeminiJsonArray(text) {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const firstBracket = trimmed.indexOf("[");
  const lastBracket = trimmed.lastIndexOf("]");

  if (firstBracket === -1 || lastBracket === -1) {
    throw new Error("Gemini response did not contain a JSON array.");
  }

  const parsed = JSON.parse(trimmed.slice(firstBracket, lastBracket + 1));

  if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string")) {
    throw new Error("Gemini response JSON must be an array of strings.");
  }

  return parsed;
}

async function translateBatch(locale, strings) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required to generate missing translations.");
  }

  const languageNames = {
    hi: "Hindi",
    ar: "Arabic",
    ru: "Russian",
  };
  const languageName = languageNames[locale] || locale;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: [
                  `Translate this JSON array from English to ${languageName}.`,
                  "Return only a JSON array of strings.",
                  "Keep the same order and item count.",
                  "Translate each full string or paragraph as one unit.",
                  "Keep brand names, doctor names, URLs, slugs, IDs, file paths, email addresses, phone numbers, and code-like values unchanged.",
                  JSON.stringify(strings),
                ].join("\n"),
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed (${response.status}): ${await response.text()}`);
  }

  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  const translated = parseGeminiJsonArray(text);

  if (translated.length !== strings.length) {
    throw new Error(`Gemini returned ${translated.length} translations for ${strings.length} strings.`);
  }

  return translated;
}

async function main() {
  const loadedMemory = loadTranslationMemory();
  const memory = DRY_RUN ? JSON.parse(JSON.stringify(loadedMemory)) : loadedMemory;
  const sources = buildTranslationSources(memory);
  let totalMissing = 0;

  for (const source of sources) {
    const collector = source.strings || collectTranslatableStrings(source.value, memory);

    for (const locale of TARGET_LOCALES) {
      const missing = getMissingTranslations(collector, locale.code, memory);
      totalMissing += missing.length;

      if (!missing.length) {
        console.log(`${source.name}:${locale.code} is complete`);
        continue;
      }

      console.log(`${source.name}:${locale.code} missing ${missing.length} strings`);

      if (DRY_RUN) {
        continue;
      }

      for (const batch of chunk(missing, BATCH_SIZE)) {
        const translated = await translateBatch(locale.code, batch);

        batch.forEach((english, index) => {
          const key = rememberEnglish(memory, english) || getTranslationKey(english);
          memory[key][locale.code] = translated[index];
        });

        saveTranslationMemory(memory);
        console.log(`saved ${batch.length} ${locale.code} translations`);
      }
    }
  }

  if (DRY_RUN) {
    console.log(`Dry run complete. Missing translations: ${totalMissing}`);
  } else {
    saveTranslationMemory(memory);
    console.log("Translation memory updated.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
