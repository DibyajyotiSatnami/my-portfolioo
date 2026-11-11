import type { Project } from "@/content/site";

const hostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/**
 * Browser-framed website preview. Uses the project's screenshot when one is
 * provided; otherwise draws a stylised page in the project's own palette.
 * The page inside the frame scrolls while the card is hovered.
 */
export function ProjectPreview({ project, variant }: { project: Project; variant: number }) {
  const [a, b, c] = project.palette;
  const style = { "--pa": a, "--pb": b, "--pc": c } as React.CSSProperties;

  return (
    <div className="preview" style={style}>
      <div className="preview-chrome">
        <span className="preview-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="preview-url">{hostname(project.url)}</span>
      </div>

      <div className="preview-viewport">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="preview-shot"
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${project.image}`}
            alt={`${project.title} website preview`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={`preview-page preview-page--${variant % 3}`} aria-hidden="true">
            <div className="pp-nav">
              <b />
              <span>
                <i />
                <i />
                <i />
              </span>
              <em />
            </div>
            <div className="pp-hero">
              <div className="pp-hero-copy">
                <small>{project.kind}</small>
                <strong className="display">{project.title}</strong>
                <span className="pp-lines">
                  <i />
                  <i />
                </span>
                <span className="pp-buttons">
                  <i />
                  <i />
                </span>
              </div>
              <div className="pp-hero-art">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="pp-strip">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="pp-cards">
              <i />
              <i />
              <i />
            </div>
            <div className="pp-banner">
              <b />
              <i />
            </div>
            <div className="pp-cards pp-cards--two">
              <i />
              <i />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
