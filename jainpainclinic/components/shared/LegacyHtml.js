export default function LegacyHtml({ html, className = "" }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
