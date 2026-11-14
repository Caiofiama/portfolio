import { Experience, Stack } from "@/components/site/Career";
import Closing from "@/components/site/Closing";
import FeaturedCards from "@/components/site/FeaturedCards";
import Hero from "@/components/site/Hero";
import Nav from "@/components/site/Nav";
import OtherProjects from "@/components/site/OtherProjects";
import ScrollEffects from "@/components/site/ScrollEffects";
import { person, siteUrl } from "@/content/site";

// Structured data: who this page is about, for search engines.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
  url: siteUrl,
  email: `mailto:${person.email}`,
  address: { "@type": "PostalAddress", addressLocality: person.city, addressRegion: "RJ", addressCountry: "BR" },
  sameAs: [person.linkedin, person.github],
  knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "C#", "ASP.NET Core", "PostgreSQL"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <FeaturedCards />
        <OtherProjects />
        <Experience />
        <Stack />
      </main>
      <Closing />
      <ScrollEffects />
    </>
  );
}
