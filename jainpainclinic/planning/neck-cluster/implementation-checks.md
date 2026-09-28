# Implementation checks — 28 September 2026

Four articles are implemented in `data/neck-blogs.js` and imported by the existing blog data module. The archive now contains 47 articles. No deployment was performed.

| Article | Approximate words, including headings and FAQs | FAQs |
|---|---:|---:|
| Neck pain treatment without surgery | 1,655 | 6 |
| Cervical spondylosis treatment | 1,674 | 6 |
| Neck pain exercises and stretches | 1,497 | 6 |
| Cervical spondylosis ICD-10 codes | 1,431 | 6 |

- Added source references, contextual links, comparison tables, table of contents, metadata and downloaded Pexels images with descriptive alt text and stock-photo credits.
- Used a clinic byline. Article schema uses the clinic entity, with a stable author type so translating the displayed clinic name does not turn it into a Person. No individual clinical review is claimed.
- Verified M47.12, M47.22, M47.812, M54.12 and M54.2 descriptors against the official [April 2026 CDC tabular XML](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2026-update/icd10cm-April-1-2026-XML.zip), downloaded and parsed locally. Coding article explains jurisdiction and release-date limitations rather than offering a billing algorithm.
- Verified unique article slugs, internal blog destinations and image files.
- Targeted ESLint and `git diff --check` passed.
- Production build, static export and existing structured-data checks passed. Sitemap regenerated through the existing build script.
- Inspected exported article metadata, FAQ schema, author entity and image references, including the existing locale routes.

The new article prose is English. Translation memory has not been regenerated; existing locale routes use the site's existing fallback behaviour for missing translations. Ubersuggest volume/difficulty metrics are still unavailable and no such metrics are claimed in these articles.
