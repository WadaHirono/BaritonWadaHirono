export const dynamic = "force-dynamic";

import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

type GalleryDoc = {
  _id: string;
  title?: string;
  images?: any[];
  videos?: string[];
};

export default async function GalleryPage() {
  let items: GalleryDoc[] = [];

  try {
    items = await client.fetch(
      `*[_type == "gallery"] | order(_createdAt desc){
        _id,
        title,
        images,
        videos
      }`
    );
  } catch (e) {
    // ✅ 取得失敗でも落とさない
    return (
      <main style={{ padding: "40px" }}>
        <p>データの取得に失敗しました。</p>
      </main>
    );
  }

  // ✅ データ無くてもOK
  if (!items || items.length === 0) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>写真・動画</h1>
        <p>現在コンテンツはありません。</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ marginBottom: "20px" }}>写真・動画</h1>

      <div style={{ display: "grid", gap: "25px" }}>
        {items.map((doc) => (
          <section
            key={doc._id}
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "15px",
            }}
          >
            {doc.title && <h2>{doc.title}</h2>}

            {/* ✅ 画像 */}
            {Array.isArray(doc.images) && doc.images.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >
                {doc.images.map((img, index) => {
                  if (!img) return null;

                  return (
                    <img
                      key={index}
                      src={urlFor(img).width(600).auto("format").url()}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* ✅ 動画（リンクのみ安全） */}
            {Array.isArray(doc.videos) && doc.videos.length > 0 && (
              <div style={{ display: "grid", gap: "10px" }}>
                {doc.videos.map((v, i) => (
                  <a
                    key={i}
                    href={v}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0070f3" }}
                  >
                    🎬 動画を見る
                  </a>
                ))}
              </div>
            )}

            {/* ✅ 何もない場合 */}
            {!doc.images?.length && !doc.videos?.length && (
              <p style={{ color: "#666" }}>
                コンテンツがありません。
              </p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}