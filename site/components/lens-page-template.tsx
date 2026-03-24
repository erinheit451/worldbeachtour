import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBeachData, getBeachMdx } from "@/lib/beaches";
import { getLens } from "@/lib/lenses";
import { mdxComponents } from "@/components/mdx-components";
import Breadcrumbs from "@/components/breadcrumbs";
import TableOfContents from "@/components/table-of-contents";

interface LensPageProps {
  slug: string;
  lens: string;
  title: string;
}

export default function LensPage({ slug, lens, title }: LensPageProps) {
  const data = getBeachData(slug);
  const mdxSource = getBeachMdx(slug, lens);
  if (!data || !mdxSource) notFound();

  const lensInfo = getLens(lens);
  const lensLabel = lensInfo?.label || title;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Beaches", href: "/beaches" },
          { label: data.name, href: `/beaches/${slug}` },
          { label: lensLabel },
        ]}
      />
      <div className="relative">
        <article className="prose prose-volcanic prose-lg max-w-none xl:max-w-3xl">
          <MDXRemote source={mdxSource} components={mdxComponents} />
        </article>
        <TableOfContents />
      </div>
    </div>
  );
}
