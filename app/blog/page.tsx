import Link from "next/link";
import { client } from "@/lib/sanity";

export const dynamic = "force-dynamic";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
};

export default async function BlogListPage() {
  const posts: Post[] = await client.fetch(
    `*[_type == "performanceBlog"] | order(coalesce(publishedAt, date) desc){
      _id,
      title,
      slug,
      "publishedAt": coalesce(publishedAt, date)
    }`
  );

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "18px" }}>ブログ（演奏活動）</h1>

      {posts.length === 0 ? (
        <p>まだ記事がありません。</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {posts.map((p) => (
            <li
              key={p._id}
              style={{
                padding: "14px 12px",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "12px",
                marginBottom: "12px",
                background: "rgba(255,255,255,0.7)",
              }}
            >
              <Link href={`/blog/${p.slug.current}`} style={{ textDecoration: "none" }}>
                <div style={{ fontWeight: 700, color: "#1b2a41" }}>{p.title}</div>
                {p.publishedAt && (
                  <div style={{ color: "#666", fontSize: "13px", marginTop: "6px" }}>
                    {new Date(p.publishedAt).toLocaleDateString("ja-JP")}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}