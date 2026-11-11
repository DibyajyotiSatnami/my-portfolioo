import { Fragment } from "react";

/**
 * Server-rendered text splitting. The real sentence is exposed once to
 * assistive technology and search engines; the animated pieces are hidden
 * from the accessibility tree so screen readers never spell letter by letter.
 */

export function Chars({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={`split ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <Fragment key={w}>
            <span className="word">
              {Array.from(word).map((char, c) => (
                <span key={c} className="char">
                  {char}
                </span>
              ))}
            </span>
            {w < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}

/** `*starred*` words get the accent treatment (serif italic). */
export function Words({ text, className = "" }: { text: string; className?: string }) {
  const tokens = text.split(" ");
  const plain = text.replace(/\*/g, "");
  return (
    <span className={`split ${className}`}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">
        {tokens.map((token, i) => {
          const accent = token.startsWith("*");
          const clean = token.replace(/\*/g, "");
          return (
            <Fragment key={i}>
              <span className={`word${accent ? " word--accent" : ""}`}>{clean}</span>
              {i < tokens.length - 1 ? " " : null}
            </Fragment>
          );
        })}
      </span>
    </span>
  );
}
