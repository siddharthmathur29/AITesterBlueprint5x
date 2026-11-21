import React, { useMemo } from "react";

function inline(text) {
  const nodes = [];
  let rest = text;
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[([^\]]+)\]\(([^)]+)\))/;
  while (rest) {
    const match = rest.match(pattern);
    if (!match) {
      nodes.push(rest);
      break;
    }
    if (match.index > 0) nodes.push(rest.slice(0, match.index));
    const token = match[0];
    if (token.startsWith("**")) nodes.push(<strong key={nodes.length}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("`")) nodes.push(<code key={nodes.length}>{token.slice(1, -1)}</code>);
    else nodes.push(<a key={nodes.length} href={match[3]} target="_blank" rel="noreferrer">{match[2]}</a>);
    rest = rest.slice(match.index + token.length);
  }
  return nodes;
}

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function PlanOutput({ markdown }) {
  const blocks = useMemo(() => parseMarkdown(markdown || ""), [markdown]);

  return <div className="plan-output">{blocks}</div>;
}

function parseMarkdown(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;
  let key = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (/^```/.test(line)) {
      const code = [];
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre key={key++} className="code-block">
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const Tag = `h${Math.min(level + 1, 6)}`;
      blocks.push(React.createElement(Tag, { key: key++, className: `md-h${level}` }, inline(heading[2])));
      index += 1;
      continue;
    }

    if (/^\|.*\|$/.test(line) && /^\|?[\s:-]+\|/.test(lines[index + 1] || "")) {
      const header = splitRow(line);
      const rows = [];
      index += 2;
      while (index < lines.length && /^\|.*\|$/.test(lines[index])) {
        rows.push(splitRow(lines[index]));
        index += 1;
      }
      blocks.push(
        <div key={key++} className="table-wrap">
          <table>
            <thead>
              <tr>{header.map((cell, cellIndex) => <th key={cellIndex}>{inline(cell)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => <td key={cellIndex}>{inline(cell)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items = [];
      while (index < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*([-*]|\d+\.)\s+/, ""));
        index += 1;
      }
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(
        React.createElement(
          ListTag,
          { key: key++ },
          items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>),
        ),
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(<blockquote key={key++}>{inline(quote.join(" "))}</blockquote>);
      continue;
    }

    if (/^\s*---+\s*$/.test(line)) {
      blocks.push(<hr key={key++} />);
      index += 1;
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6}\s|```|\||>\s?|\s*([-*]|\d+\.)\s+|---)/.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(<p key={key++}>{inline(paragraph.join(" "))}</p>);
  }

  return blocks;
}
