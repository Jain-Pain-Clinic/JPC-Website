import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { blogs, BLOGS_PER_PAGE } from "../data/blogs.js";
import { treatments } from "../data/treatments.js";
import { procedures } from "../data/procedures.js";
import { LOCALES, localizePath } from "../lib/i18n-config.js";

const SITE_URL = "https://www.jainpainclinic.com";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function entry({ path, lastmod, changefreq = "monthly", priority = "0.8" }) {
  const lines = [
    "  <url>",
    `    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>`,
  ];

  LOCALES.forEach((locale) => {
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="${escapeXml(locale.code)}" href="${escapeXml(`${SITE_URL}${localizePath(path, locale.code)}`)}" />`
    );
  });
  lines.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${SITE_URL}${localizePath(path, "en")}`)}" />`
  );

  if (lastmod) {
    lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  }

  lines.push(`    <changefreq>${changefreq}</changefreq>`);
  lines.push(`    <priority>${priority}</priority>`);
  lines.push("  </url>");

  return lines.join("\n");
}

const totalBlogPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);

const routes = [
  { path: "/", changefreq: "monthly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/exercise", changefreq: "monthly", priority: "0.7" },
  { path: "/contact-us", changefreq: "monthly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.9" },
  ...Array.from({ length: Math.max(totalBlogPages - 1, 0) }, (_, index) => ({
    path: `/blog/page-${index + 2}`,
    changefreq: "weekly",
    priority: "0.6",
  })),
  ...blogs.map((blog) => ({
    path: blog.canonicalPath || `/blog/${blog.slug}`,
    lastmod: blog.publishedAt,
    changefreq: "monthly",
    priority: "0.8",
  })),
  ...treatments.map((treatment) => ({
    path: treatment.canonicalPath || `/treatments/${treatment.slug}`,
    changefreq: "monthly",
    priority: "0.8",
  })),
  ...procedures.map((procedure) => ({
    path: procedure.canonicalPath || `/procedures/${procedure.slug}`,
    changefreq: "monthly",
    priority: "0.8",
  })),
];

const localizedRoutes = routes.flatMap((route) =>
  LOCALES.map((locale) => ({
    ...route,
    path: localizePath(route.path, locale.code),
  }))
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${localizedRoutes.map(entry).join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
console.log(`Generated sitemap.xml with ${localizedRoutes.length} URLs`);
