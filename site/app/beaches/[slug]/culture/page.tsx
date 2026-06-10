import LensPage from "@/components/lens-page-template";

export default async function CulturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LensPage slug={slug} lens="culture" title="Culture" />;
}
