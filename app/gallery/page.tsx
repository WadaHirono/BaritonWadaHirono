export const dynamic = "force-dynamic";

import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

type GalleryDoc = {
  _id: string;
  title?: string;
  image?: any;       // ✅ 単一画像
  videos?: string[]; // ✅ 複数動画
};

// ✅ YouTube URL → 埋め込み変換
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
        image,
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
      <h1 style={{ marginBottom: "20px" }}>写真・動画</h1>

      {items.map((doc) => (
        <section key={doc._id} style={{ marginBottom: "40px" }}>
          
          {doc.title && (
            <h2 style={{ marginBottom: "15px" }}>
              {doc.title}
            </h2>
          )}

          {/* ✅ 画像（単体） */}
          {doc.image && (
            <div style={{ marginBottom: "20px" }}>
              {urlFor(doc.image).width(800).auto("format").url()}                alt={doc.title ?? "image"}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                }}
              />
            </div>
          )}

          {/* ✅ 動画（埋め込み） */}
          {Array.isArray(doc.videos) && doc.videos.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {doc.videos.map((url, index) => {
                if (!url) return null;

                const embed = toEmbedUrl(url);

                return (
                  <div key={index}>
                    {embed ? (
                      <div
                        style={{
                          position: "relative",
                          paddingTop: "56.25%",
                          borderRadius: "12px",
                          overflow: "hidden",
                          background: "#000",
                        }}
                      >
                        {embed}
                      </div>
                    ) : (
                      {url}
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