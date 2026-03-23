import LensPage from "@/components/lens-page-template";

export default async function SandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="sand" title="Sand & Geology" />;
}
