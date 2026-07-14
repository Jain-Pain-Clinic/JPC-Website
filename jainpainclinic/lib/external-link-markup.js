const WHATSAPP_CONSULT_URL =
  "https://wa.me/919211281009?text=Hi%2C%20I%20want%20to%20live%20pain%20free";

function mergeRelTokens(existingRel, requiredTokens) {
  const tokens = new Set(
    existingRel
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(Boolean)
  );

  requiredTokens.forEach((token) => tokens.add(token));

  return [...tokens].join(" ");
}

export function normalizeWhatsAppConsultLinks(markup) {
  if (!markup) {
    return markup;
  }

  return markup.replace(
    new RegExp(`<a\\b([^>]*\\bhref="${WHATSAPP_CONSULT_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*)>`, "g"),
    (match, attributes) => {
      let nextAttributes = attributes;

      if (!/\btarget=/.test(nextAttributes)) {
        nextAttributes += ' target="_blank"';
      }

      if (/\brel="([^"]*)"/.test(nextAttributes)) {
        nextAttributes = nextAttributes.replace(/\brel="([^"]*)"/, (_, relValue) => {
          return `rel="${mergeRelTokens(relValue, ["nofollow", "noreferrer"])}"`;
        });
      } else {
        nextAttributes += ' rel="nofollow noreferrer"';
      }

      return `<a${nextAttributes}>`;
    }
  );
}
