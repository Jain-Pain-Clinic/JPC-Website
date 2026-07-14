import fs from "fs";
import path from "path";
import { normalizeWhatsAppConsultLinks } from "./external-link-markup";

const LEGACY_ROOT = path.join(process.cwd(), "content", "legacy-site");

function readLegacyHtml(relativePath) {
  return fs.readFileSync(path.join(LEGACY_ROOT, relativePath), "utf8");
}

function normalizeLegacyMarkup(markup) {
  return normalizeWhatsAppConsultLinks(markup)
    .replace(/src="\.\.\/assets\//g, 'src="/assets/')
    .replace(/src="assets\//g, 'src="/assets/')
    .replace(/href="\.\.\/assets\//g, 'href="/assets/')
    .replace(/href="assets\//g, 'href="/assets/')
    .replace(/href="\.\.\/blog\/([^"]+)"/g, 'href="/blog/$1"')
    .replace(/href="blog\/([^"]+)"/g, 'href="/blog/$1"')
    .replace(/href="\.\.\/blog"/g, 'href="/blog"')
    .replace(/href="blog"/g, 'href="/blog"')
    .replace(/href="\.\.\/treatments\//g, 'href="/treatments/')
    .replace(/href="treatments\//g, 'href="/treatments/')
    .replace(/href="\.\.\/procedures\//g, 'href="/procedures/')
    .replace(/href="procedures\//g, 'href="/procedures/')
    .replace(/href="\.\.\/about"/g, 'href="/about"')
    .replace(/href="about"/g, 'href="/about"')
    .replace(/href="\.\.\/contact-us"/g, 'href="/contact-us"')
    .replace(/href="contact-us"/g, 'href="/contact-us"')
    .replace(/href="\.\.\/exercise"/g, 'href="/exercise"')
    .replace(/href="exercise"/g, 'href="/exercise"')
    .replace(/href="\.\.\/"/g, 'href="/"')
    .replace(/href="\.\.\/#/g, 'href="/#')
    .replace(/href="#contact-form"/g, 'href="#contact"');
}

function extractMatches(html, patterns) {
  return patterns
    .map((pattern) => html.match(pattern))
    .filter(Boolean)
    .map((match) => normalizeLegacyMarkup(match[0]));
}

export function getLegacyBlocks(relativePath, type) {
  const html = readLegacyHtml(relativePath);

  if (type === "blog") {
    return extractMatches(html, [
      /<section class="blog-post-hero">[\s\S]*?<\/section>/,
      /<div class="wrap">\s*<div class="blog-post-banner[\s\S]*?<\/div>\s*<\/div>/,
      /<article class="blog-post-article"[\s\S]*?<\/article>/,
    ]);
  }

  if (type === "treatment") {
    return extractMatches(html, [
      /<section class="treatment-hero">[\s\S]*?<\/section>/,
      /<div class="wrap">\s*<div class="treatment-banner[\s\S]*?<\/div>\s*<\/div>/,
      /<section class="treatment-article">[\s\S]*?<\/section>/,
      /<section class="treatment-offer">[\s\S]*?<\/section>/,
      /<section class="treatment-faq">[\s\S]*?<\/section>/,
    ]);
  }

  if (type === "procedure") {
    return extractMatches(html, [
      /<section class="treatment-hero">[\s\S]*?<\/section>/,
      /<div class="wrap">\s*<div class="treatment-banner[\s\S]*?<\/div>\s*<\/div>/,
      /<section class="journey">[\s\S]*?<\/section>/,
      /<section class="quiz-video">[\s\S]*?<\/section>/,
      /<section class="treatment-faq">[\s\S]*?<\/section>/,
    ]);
  }

  return [];
}

export function getLegacyInteractiveScripts(relativePath) {
  const html = readLegacyHtml(relativePath);

  const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];

  return scriptMatches
    .map((match) => match[1].trim())
    .filter(
      (scriptContent) =>
        scriptContent.includes("window.journeyContent") ||
        scriptContent.includes("window.quizQuestions") ||
        scriptContent.includes("var questions = [")
    )
    .map(normalizeLegacyMarkup);
}
