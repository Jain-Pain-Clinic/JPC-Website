export default function RichTextInline({ parts = [] }) {
  return parts.map((part, index) => {
    const prefix = index === 0 ? "" : " ";

    if (part.type === "strong") {
      return (
        <span key={`${part.type}-${index}`}>
          {prefix}
          <strong>{part.text}</strong>
        </span>
      );
    }

    if (part.type === "link") {
      return (
        <span key={`${part.type}-${index}`}>
          {prefix}
          <a href={part.href}>{part.text}</a>
        </span>
      );
    }

    return (
      <span key={`${part.type}-${index}`}>
        {prefix}
        {part.text}
      </span>
    );
  });
}
