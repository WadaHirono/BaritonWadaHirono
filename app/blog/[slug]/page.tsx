import { client } from "@/lib/sanity";
import PortableContent from "@/components/PortableContent";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function BlogDetailPage({ params }: { params: Params }) {
  const post = await client.fetch(
    `*[_type == "blog" && site == "performance" && slug.current == $slug][0]{
      title, publishedAt, body
    }`,
    { slug: params.slug }
  );

  if (!post) {
    return (
      <main style={{ padding: "40px" }}>
        <p>記事が見つかりませんでした。</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "8px" }}>{post.title}</h1>
      {post.publishedAt && (
        <p style={{ color: "#666", marginTop: 0 }}>
          {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
        </p>
      )}

      <div style={{ marginTop: "22px" }}>
        <PortableContent value={post.body} />
      </div>
    </main>
  );
}