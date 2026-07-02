import type { BeachData } from "@/lib/beaches";

export default function BeachJsonLd({ data }: { data: BeachData }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Beach",
    name: data.name,
    description: `${data.name} — a ${data.substrate_type !== "unknown" ? data.substrate_type + " " : ""}beach${data.admin_level_1 ? ` in ${data.admin_level_1}` : ""}${data.country_code ? `, ${data.country_code}` : ""}.`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: data.centroid_lat,
      longitude: data.centroid_lng,
    },
    ...(data.country_code && {
      address: {
        "@type": "PostalAddress",
        addressCountry: data.country_code,
        ...(data.admin_level_1 && { addressRegion: data.admin_level_1 }),
      },
    }),
    url: `https://worldbeachtour.com/beaches/${data.slug}`,
    isAccessibleForFree: true,
    publicAccess: true,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://worldbeachtour.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Beaches",
        item: "https://worldbeachtour.com/beaches",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.name,
        item: `https://worldbeachtour.com/beaches/${data.slug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, breadcrumb]) }}
    />
  );
}
