import React, { useMemo } from "react";

function inline(text, keyPrefix = "") {
  const nodes = [];
  let rest = text;
  let index = 0;
  const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|\[([^\]]+)\]\(([^)]+)\))/;
  while (rest) {
    const match = rest.match(pattern);
    if (!match) {
      nodes.push(rest);
      break;
    }
    if (match.index > 0) nodes.push(rest.slice(0, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${index++}`;
    if (token.startsWith("**")) nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("*")) nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    else if (token.startsWith("`")) nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    else nodes.push(<a key={key} href={match[3]} target="_blank" rel="noreferrer">{match[2]}</a>);
    rest = rest.slice(match.index + token.length);
  }
  return nodes;
}

function splitRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function indentOf(line) {
  return line.match(/^\s*/)[0].replace(/\t/g, "  ").length;
}

function isListLine(line) {
  return /^\s*([-*]|\d+\.)\s+/.test(line);
}

function parseList(lines, start, key) {
  const baseIndent = indentOf(lines[start]);
  const ordered = /^\s*\d+\./.test(lines[start]);
  const items = [];
  let index = start;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      const next = lines[index + 1];
      if (next && isListLine(next) && indentOf(next) >= baseIndent) {
        index += 1;
        continue;
      }
      break;
    }
    if (!isListLine(line) || indentOf(line) !== baseIndent) break;

    const text = line.replace(/^\s*([-*]|\d+\.)\s+/, "");
    const item = { text, children: null };
    index += 1;

    if (index < lines.length && isListLine(lines[index]) && indentOf(lines[index]) > baseIndent) {
      const nested = parseList(lines, index, `${key}-${items.length}`);
      item.children = nested.node;
      index = nested.nextIndex;
    } else {
      while (
        index < lines.length &&
        lines[index].trim() &&
        !isListLine(lines[index]) &&
        indentOf(lines[index]) > baseIndent &&
        !/^#{1,6}\s/.test(lines[index])
      ) {
        item.text += ` ${lines[index].trim()}`;
        index += 1;
      }
    }

    items.push(item);
  }

  const ListTag = ordered ? "ol" : "ul";
  const node = React.createElement(
    ListTag,
    { key: `l${key}` },
    items.map((item, itemIndex) =>
      React.createElement("li", { key: itemIndex }, inline(item.text, `li${key}-${itemIndex}`), item.children),
    ),
  );

  return { node, nextIndex: index };
}

export function CaseOutput({ markdown }) {
  const blocks = useMemo(() => parseMarkdown(markdown || ""), [markdown]);
  return <div className="case-output">{blocks}</div>;
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
      blocks.push(React.createElement(Tag, { key: key++, className: `md-h${level}` }, inline(heading[2], `h${key}`)));
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
              <tr>
                {header.map((cell, cellIndex) => (
                  <th key={cellIndex}>{inline(cell, `th${cellIndex}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{inline(cell, `td${rowIndex}-${cellIndex}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (isListLine(line)) {
      const { node, nextIndex } = parseList(lines, index, key++);
      blocks.push(node);
      index = nextIndex;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(<blockquote key={key++}>{inline(quote.join(" "), `q${key}`)}</blockquote>);
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
    blocks.push(<p key={key++}>{inline(paragraph.join(" "), `p${key}`)}</p>);
  }

  return blocks;
}
