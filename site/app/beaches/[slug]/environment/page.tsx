import LensPage from "@/components/lens-page-template";

export default async function EnvironmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="environment" title="Environment" />;
}
