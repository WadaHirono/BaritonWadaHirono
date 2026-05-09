export const dynamic = "force-dynamic";

import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

type GalleryDoc = {
  _id: string;
  title?: string;
  images?: any[];
  image?: any; // 互換用（旧）
  videos?: string[];
};

// ✅ YouTube URL → embed URL
function toEmbedUrl(url: string) {
  try {
    const u = new URL(url);

    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    // youtube.com/...
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;

      const parts = u.pathname.split("/").filter(Boolean);

      // /shorts/<id>
      const shortsIndex = parts.indexOf("shorts");
      if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[shortsIndex + 1]}`;
      }

      // /embed/<id>
      const embedIndex = parts.indexOf("embed");
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[embedIndex + 1]}`;
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
    // ✅ images が無い古いデータでも image を images として扱えるようにする
    items = await client.fetch(
      `*[_type == "gallery"] | order(_createdAt desc){
        _id,
        title,
        images,
        image,
        videos,
        "normalizedImages": select(
          defined(images) && length(images) > 0 => images,
          defined(image) => [image],
          []
        )
      }`
    );
  } catch {
    return (
      <main style={{ padding: "40px" }}>
        <h1>写真・動画</h1>
        <p>データの取得に失敗しました。</p>
      </main>
    );
  }

  // normalizedImages を使うため any で受ける（落ちない優先）
  const safeItems = items as any[];

  // ✅ 写真コーナー用：全写真を平坦化して集める
  const allPhotos: any[] = safeItems.flatMap((d) =>
    Array.isArray(d.normalizedImages) ? d.normalizedImages : []
  );

  // ✅ 動画コーナー用：全動画URLを平坦化して集める
  const allVideos: string[] = safeItems.flatMap((d) =>
    Array.isArray(d.videos) ? d.videos : []
  );

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>写真・動画</h1>

      {/* ✅ 写真コーナー */}
      <section style={{ marginBottom: "45px" }}>
        <h2
          style={{
            marginBottom: "16px",
            borderBottom: "2px solid #ccc",
            paddingBottom: "6px",
          }}
        >
          📷 写真
        </h2>

        {allPhotos.length === 0 ? (
          <p style={{ color: "#666" }}>写真がありません。</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {allPhotos.map((img: any, idx: number) => {
              if (!img) return null;

              const src = urlFor(img).width(900).auto("format").url();
              const caption = img?.caption;

              return (
                <figure key={img?._key ?? idx} style={{ margin: 0 }}>
                  <img
                    src={src}
                    alt={caption || `写真 ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "1px solid #eee",
                      display: "block",
                    }}
                  />
                  {caption && (
                    <figcaption style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
                      {caption}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}
      </section>

      {/* ✅ 動画コーナー */}
      <section>
        <h2
          style={{
            marginBottom: "16px",
            borderBottom: "2px solid #ccc",
            paddingBottom: "6px",
          }}
        >
          🎥 動画
        </h2>

        {allVideos.length === 0 ? (
          <p style={{ color: "#666" }}>動画がありません。</p>
        ) : (
          <div style={{ display: "grid", gap: "18px" }}>
            {allVideos.map((url, idx) => {
              if (!url) return null;
              const embed = toEmbedUrl(url);

              return (
                <div key={`video-${idx}`}>
                  {embed ? (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        paddingTop: "56.25%",
                        borderRadius: "12px",
                        overflow: "hidden",
                        background: "#000",
                        border: "1px solid #eee",
                      }}
                    >
                      <iframe
                        src={embed}
                        title={`video-${idx + 1}`}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          border: 0,
                        }}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0070f3", textDecoration: "underline", wordBreak: "break-word" }}
                    >
                      🎬 動画リンクを開く
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