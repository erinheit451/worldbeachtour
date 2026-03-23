import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBeachData, getBeachMdx } from "@/lib/beaches";
import { mdxComponents } from "@/components/mdx-components";
import MapEmbed from "@/components/map-embed";

interface LensPageProps {
  slug: string;
  lens: string;
  title: string;
}

export default function LensPage({ slug, lens, title }: LensPageProps) {
  const data = getBeachData(slug);
  const mdxSource = getBeachMdx(slug, lens);
  if (!data || !mdxSource) notFound();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{data.name} — {title}</h2>
      <article className="prose prose-gray max-w-none mb-8">
        <MDXRemote source={mdxSource} components={mdxComponents} />
      </article>
      <MapEmbed lat={data.centroid_lat} lng={data.centroid_lng} name={data.name} />
    </div>
  );
}
