import Link from "next/link";
import { client } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params?.slug;

  // ✅ slugチェック
  if (!slug) {
    return (
      <main style={{ padding: "40px" }}>
        <p>URLが正しくありません。</p>
      </main>
    );
  }

  // ✅ ここが超重要（slugを渡す）
  const post = await client.fetch(
    `*[_type == "performanceBlog" && slug.current == $slug][0]{
      title,
      "publishedAt": coalesce(publishedAt, date),
      content
    }`,
    { slug } // ← ✅ これがないとエラー
  );

  if (!post) {
    return (
      <main style={{ padding: "40px" }}>
        <p>記事が見つかりません。</p>
        <Link href="/blog">ブログ一覧に戻る</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <Link href="/blog">← ブログ一覧に戻る</Link>

      <h1>{post.title}</h1>

      {post.publishedAt && (
        <p style={{ color: "#666" }}>
          {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
        </p>
      )}

      <div style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
        {post.content}
      </div>
    </main>
  );
}