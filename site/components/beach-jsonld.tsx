// Only the fields this component actually reads. Declared structurally (rather
// than importing a specific BeachData) so it accepts both the lib/beaches shape
// and the legendary-v2 bundle shape — they differ elsewhere but agree on these.
interface BeachJsonLdData {
  slug: string;
  name: string;
  centroid_lat: number;
  centroid_lng: number;
  country_code: string;
  admin_level_1: string;
  substrate_type: string | null;
}

export default function BeachJsonLd({ data }: { data: BeachJsonLdData }) {
  const hasSubstrate = data.substrate_type && data.substrate_type !== "unknown";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Beach",
    name: data.name,
    description: `${data.name} — a ${hasSubstrate ? data.substrate_type + " " : ""}beach${data.admin_level_1 ? ` in ${data.admin_level_1}` : ""}${data.country_code ? `, ${data.country_code}` : ""}.`,
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
