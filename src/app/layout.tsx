import type { Metadata } from "next";
import "./globals.css";
import { profile } from "@/data/profile";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://conold-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: profile.title, template: "%s — Conold Chisinahama" },
  description: profile.description,
  authors: [{ name: "Conold Thando Chisinahama" }],
  openGraph: { type: "website", locale: "en_ZA", siteName: "Conold Chisinahama", title: profile.title, description: profile.description, images: [{ url: "/opengraph-image" }] },
  twitter: { card: "summary_large_image", title: profile.title, description: profile.description, images: ["/opengraph-image"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const person = { "@context": "https://schema.org", "@type": "Person", name: "Conold Thando Chisinahama", jobTitle: profile.role, email: "mailto:cthandoc@gmail.com", address: { "@type": "PostalAddress", addressLocality: "Johannesburg", addressCountry: "ZA" }, sameAs: ["https://www.linkedin.com/in/conold/", "https://github.com/thvndx"] };
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main">{children}</main><SiteFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} /></body></html>;
}
