import LensPage from "@/components/lens-page-template";

export default async function SurfPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="surf" title="Surf Conditions" />;
}
