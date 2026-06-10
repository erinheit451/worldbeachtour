import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBeachData, getBeachMdx, getBeachMeta } from "@/lib/beaches";
import { getLens } from "@/lib/lenses";
import { computeTier } from "@/lib/tier";
import { mdxComponents } from "@/components/mdx-components";
import Breadcrumbs from "@/components/breadcrumbs";
import TableOfContents from "@/components/table-of-contents";

interface LensPageProps {
  slug: string;
  lens: string;
  title: string;
}

const SUBPAGE_MIN_WORDS = 300;

function wordCount(mdx: string): number {
  // Strip code fences, frontmatter, and JSX/MDX tags so the count reflects
  // prose only — a 50-word section with a big <DataCard> shouldn't pass.
  const stripped = mdx
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, " ");
  return stripped.split(/\s+/).filter(Boolean).length;
}

export default function LensPage({ slug, lens, title }: LensPageProps) {
  const data = getBeachData(slug);
  const meta = getBeachMeta(slug);
  const mdxSource = getBeachMdx(slug, lens);
  if (!data || !mdxSource) notFound();

  // Subpage policy (architecture doc, rule 6): subpages exist only on T2+
  // beaches with genuine overflow content. Below either threshold, 404.
  const tier = computeTier(slug, data, meta);
  if (tier < 2) notFound();
  if (wordCount(mdxSource) < SUBPAGE_MIN_WORDS) notFound();

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
