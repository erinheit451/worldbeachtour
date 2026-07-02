// Site-wide structured data: Organization + WebSite. Rendered once in the root
// layout so every page carries the publisher/site identity that Google and Bing
// use for knowledge-panel and sitelink eligibility.
export default function SiteJsonLd() {
  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://worldbeachtour.com/#organization",
      name: "World Beach Tour",
      url: "https://worldbeachtour.com",
      description:
        "The canonical page for every beach on Earth — real history, real climate data, real local knowledge, one beach at a time.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://worldbeachtour.com/#website",
      name: "World Beach Tour",
      url: "https://worldbeachtour.com",
      publisher: { "@id": "https://worldbeachtour.com/#organization" },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
