import LensPage from "@/components/lens-page-template";

export default async function FamilyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="family" title="Family Guide" />;
}
