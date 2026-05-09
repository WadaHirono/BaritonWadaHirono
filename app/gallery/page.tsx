export const dynamic = "force-dynamic";

import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

type GalleryDoc = {
  _id: string;
  title?: string;
  images?: any[];
  videos?: string[];
};

// ✅ YouTube埋め込み変換（完全版）
function toEmbedUrl(url: string) {
  try {
    const u = new URL(url);

    // youtu.be
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    // youtube.com
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;

      const parts = u.pathname.split("/").filter(Boolean);

      if (parts.includes("shorts")) {
        const id = parts[parts.indexOf("shorts") + 1];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (parts.includes("embed")) {
        const id = parts[parts.indexOf("embed") + 1];
        return id ? `https://www.youtube.com/embed/${id}` : null;
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
        <h1>写真・動画</h1>
        <p>データ取得に失敗しました。</p>
      </main>
    );
  }

  // ✅ 写真まとめ
  const allImages = items.flatMap((doc) =>
    Array.isArray(doc.images) ? doc.images : []
  );

  // ✅ 動画まとめ
  const allVideos = items.flatMap((doc) =>
    Array.isArray(doc.videos) ? doc.videos : []
  );

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>写真・動画</h1>

      {/* ✅ 写真セクション */}
      <section style={{ marginBottom: "50px" }}>
        <h2
          style={{
            marginBottom: "20px",
            borderBottom: "2px solid #ccc",
            paddingBottom: "5px",
          }}
        >
          📷 写真
        </h2>

        {allImages.length === 0 ? (
          <p>写真はありません。</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {allImages.map((img, i) => {
              if (!img) return null;

              return (
                <img
                  key={img?._key ?? i}
                  src={urlFor(img).width(800).auto("format").url()}
                  alt={`photo-${i}`}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* ✅ 動画セクション */}
      <section>
        <h2
          style={{
            marginBottom: "20px",
            borderBottom: "2px solid #ccc",
            paddingBottom: "5px",
          }}
        >
          🎥 動画
        </h2>

        {allVideos.length === 0 ? (
          <p>動画はありません。</p>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {allVideos.map((url, i) => {
              if (!url) return null;

              const embed = toEmbedUrl(url);

              return (
                <div key={i}>
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
                      <iframe
                        src={embed}
                        title={`video-${i}`}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          border: "0",
                        }}
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a href={url} target="_blank">
                      🎬 動画を見る
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}