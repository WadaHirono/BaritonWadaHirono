import Link from "next/link";
import { client } from "@/lib/sanity";

export const dynamic = "force-dynamic";

type Post = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  publishedAt?: string;
  content?: string;
  image?: any;
};

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params?.slug;

  if (!slug) {
    return (
      <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
        <p>URLが正しくありません。</p>
        <p>
          /blog に戻る
        </p>
      </main>
    );
  }

  const post: Post | null = await client.fetch(
    `*[_type == "performanceBlog" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      "publishedAt": coalesce(publishedAt, date),
      content,
      image
    }`,
    { slug }
  );

  if (!post) {
    return (
      <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
        <h1>記事が見つかりませんでした</h1>
        <p style={{ color: "#666" }}>URL: /blog/{slug}</p>
        <p>
          /blog に戻る
        </p>
      </main>
    );
  }

  // ✅ 日付は「あるときだけ」表示（Invalid time value を防ぐ）
  const dateText =
    post.publishedAt && !Number.isNaN(Date.parse(post.publishedAt))
      ? new Date(post.publishedAt).toLocaleDateString("ja-JP")
      : null;

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <p style={{ marginBottom: "16px" }}>
        /blog に戻る
      </p>

      <h1 style={{ marginBottom: "10px" }}>{post.title ?? "ブログ"}</h1>

      {dateText && (
        <p style={{ color: "#666", marginTop: 0, marginBottom: "22px" }}>
          {dateText}
        </p>
      )}

      {/* ✅ 本文（改行対応） */}
      <div
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: "1.9",
          background: "rgba(255,255,255,0.65)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "14px",
          padding: "18px",
        }}
      >
        {post.content ?? "本文がまだ入力されていません。"}
      </div>
    </main>
  );
}