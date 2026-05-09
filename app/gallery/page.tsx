export const dynamic = "force-dynamic";

import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

type GalleryDoc = {
  _id: string;
  title?: string;
  images?: any[];
  videos?: string[];
};

// ✅ YouTube URL → embed変換
function toEmbedUrl(url: string) {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }

    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;

      if (u.pathname.includes("shorts")) {
        const id = u.pathname.split("/")[2];
        return `https://www.youtube.com/embed/${id}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

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
  } catch {
    return (
      <main style={{ padding: "40px" }}>
        <p>データの取得に失敗しました。</p>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>写真・動画</h1>
        <p>コンテンツがありません。</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1>写真・動画</h1>

      {items.map((doc) => (
        <section key={doc._id} style={{ marginBottom: "30px" }}>
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
              {doc.images.map((img, i) => {
                if (!img) return null;

                return (
                  <img
                    key={i}
                    src={urlFor(img).width(600).auto("format").url()}
                    alt={doc.title ?? "image"}
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

          {/* ✅ 動画 */}
          {Array.isArray(doc.videos) && doc.videos.length > 0 && (
            <div style={{ display: "grid", gap: "20px" }}>
              {doc.videos.map((v, i) => {
                const embed = toEmbedUrl(v);

                return (
                  <div key={i}>
                    {embed ? (
                      <div
                        style={{
                          position: "relative",
                          paddingTop: "56.25%",
                        }}
                      >
                        <iframe
                          src={embed}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                          }}
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <a href={v} target="_blank" rel="noopener noreferrer">
                        🎬 動画を見る
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </main>
  );
}