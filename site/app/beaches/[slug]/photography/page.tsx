import LensPage from "@/components/lens-page-template";

export default async function PhotographyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="photography" title="Photography" />;
}
