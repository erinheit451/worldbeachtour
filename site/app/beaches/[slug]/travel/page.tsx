import LensPage from "@/components/lens-page-template";

export default async function TravelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="travel" title="Travel Guide" />;
}
