/**
 * Single source of truth for everything written on the site.
 * Edit this file to change copy, projects, services and contact details.
 */

export const site = {
  name: "Dibyajyoti",
  initials: "DS",
  role: "Web Developer & Digital Marketer",
  tagline: "I build digital experiences.",
  description:
    "Dibyajyoti designs and builds fast, cinematic websites and grows them with Google Maps SEO, Meta Ads and performance marketing.",
  /** Public URL of the deployed site — used for canonical + Open Graph tags. */
  url: "https://example.com",
  /**
   * WhatsApp number in international format, digits only (e.g. "919876543210").
   * While this is empty the CTA opens WhatsApp without a pre-selected chat.
   */
  whatsappNumber: "",
  whatsappMessage: "Hi Dibyajyoti, I'd like to talk about a project.",
  /** Optional: { label: "Instagram", href: "https://…" } */
  socials: [] as { label: string; href: string }[],
  copyrightYear: "2026",
};

export const whatsappHref = () => {
  const text = encodeURIComponent(site.whatsappMessage);
  return `https://wa.me/${site.whatsappNumber}?text=${text}`;
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
] as const;

export const roles = [
  "Website Development",
  "Google Maps SEO",
  "Digital Marketing",
  "Meta Ads",
  "Performance Marketing",
] as const;

export type Project = {
  title: string;
  kind: string;
  services: string[];
  year: string;
  /** Live website — opened in a new tab when the project is clicked. */
  url: string;
  /**
   * Optional screenshot in /public (e.g. "/work/project.jpg"). A tall,
   * full-page capture works best: it pans on hover. Without one, a
   * generated preview in `palette` colours is shown instead.
   */
  image?: string;
  palette: [string, string, string];
};

/**
 * SAMPLE ENTRIES — replace the title, url (and ideally image) of each one
 * with your real client projects.
 */
export const projects: Project[] = [
  {
    title: "Restaurant Experience",
    kind: "Hospitality website",
    services: ["Website Development", "Google Maps SEO"],
    year: "2026",
    url: "https://example.com",
    palette: ["#ff4d1f", "#ffae1a", "#1a0b06"],
  },
  {
    title: "Real Estate Launch",
    kind: "Lead-generation landing page",
    services: ["Website Development", "Meta Ads"],
    year: "2026",
    url: "https://example.com",
    palette: ["#6d4bff", "#22d3ee", "#0a0820"],
  },
  {
    title: "Online Storefront",
    kind: "E-commerce store",
    services: ["Website Development", "Performance Marketing"],
    year: "2025",
    url: "https://example.com",
    palette: ["#c8ff3d", "#19c37d", "#06140d"],
  },
  {
    title: "Clinic Booking",
    kind: "Healthcare website",
    services: ["Website Development", "Digital Marketing"],
    year: "2025",
    url: "https://example.com",
    palette: ["#ff5fa2", "#ffb86b", "#1c0812"],
  },
];

export type ServiceId = "web" | "maps" | "marketing" | "meta" | "performance";

export const services: {
  id: ServiceId;
  title: string;
  summary: string;
  points: string[];
}[] = [
  {
    id: "web",
    title: "Website Development",
    summary:
      "Fast, cinematic websites engineered to convert — designed, built and launched end to end.",
    points: ["Business websites", "Landing pages", "E-commerce", "Speed & Core Web Vitals"],
  },
  {
    id: "maps",
    title: "Google Maps SEO",
    summary:
      "Put your business on the map — literally. Profile optimisation that earns a place in the local pack.",
    points: ["Business Profile setup", "Local keywords", "Review strategy", "Citations"],
  },
  {
    id: "marketing",
    title: "Digital Marketing",
    summary:
      "One connected strategy across search, social and content, so every channel pushes in the same direction.",
    points: ["Strategy", "Content", "Social media", "Email"],
  },
  {
    id: "meta",
    title: "Meta Ads",
    summary:
      "Facebook and Instagram campaigns with sharp creative and precise audience targeting.",
    points: ["Campaign setup", "Audience targeting", "Creative testing", "Retargeting"],
  },
  {
    id: "performance",
    title: "Performance Marketing",
    summary:
      "Every click tracked. Data-driven campaigns optimised for leads, sales and return on ad spend.",
    points: ["Conversion tracking", "Funnel optimisation", "A/B testing", "Reporting"],
  },
];
