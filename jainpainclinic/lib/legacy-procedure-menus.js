import { procedures } from "@/data/procedures";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildProcedureLinks(indent = "            ") {
  return procedures
    .map((procedure) => {
      const label = escapeHtml(procedure.navLabel || procedure.title);
      return `${indent}<a href="/procedures/${procedure.slug}">${label}</a>`;
    })
    .join("\n");
}

export function normalizeLegacyProcedureMenus(html) {
  const desktopProcedureLinks = buildProcedureLinks();
  const mobileProcedureLinks = buildProcedureLinks();
  const footerProcedureLinks = buildProcedureLinks("          ");

  return html
    .replace(
      /(<a href="#">Procedures <span aria-hidden="true">▾<\/span><\/a>\s*<div class="nav-dropdown__menu">)[\s\S]*?(\s*<\/div>\s*<\/div>)/,
      `$1\n${desktopProcedureLinks}$2`
    )
    .replace(
      /(<div class="nav-mobile-links__col">\s*<h3>Procedures<\/h3>)[\s\S]*?(\s*<\/div>\s*<div class="nav-mobile-links__col">\s*<h3>Quick links<\/h3>)/,
      `$1\n${mobileProcedureLinks}$2`
    )
    .replace(
      /(<div class="footer-column">\s*<h3>Procedures<\/h3>)[\s\S]*?(\s*<\/div>\s*<div class="footer-column">\s*<h3>Quick links<\/h3>)/,
      `$1\n${footerProcedureLinks}$2`
    );
}
