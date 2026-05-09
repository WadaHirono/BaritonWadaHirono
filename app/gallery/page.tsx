export const dynamic = "force-dynamic";

import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import GalleryPhotoLightbox from "@/components/GalleryPhotoLightbox";

type GalleryDoc = {
  _id: string;
  title?: string;
  images?: any[];
  videos?: string[];
};

// ✅ YouTube URL → embed URL
function toEmbedUrl(url: string) {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;

      const parts = u.pathname.split("/").filter(Boolean);

      const shortsIndex = parts.indexOf("shorts");
      if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[shortsIndex + 1]}`;
      }

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

  // ✅ 写真（全ドキュメントから集約）
  const allPhotos = items.flatMap((d) => (Array.isArray(d.images) ? d.images : []));
  const photoItems = allPhotos
    .filter(Boolean)
    .map((img: any, idx: number) => {
      const caption = img?.caption;
      return {
        thumbSrc: urlFor(img).width(800).height(500).fit("crop").auto("format").url(),
        fullSrc: urlFor(img).width(1600).auto("format").url(),
        alt: caption ? `写真 ${idx + 1}（${caption}）` : `写真 ${idx + 1}`,
        caption,
      };
    });

  // ✅ 動画（全ドキュメントから集約）
  const allVideos = items.flatMap((d) => (Array.isArray(d.videos) ? d.videos : []));

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>写真・動画</h1>

      {/* ✅ 写真コーナー（クリックで拡大＋スライド） */}
      <section style={{ marginBottom: "50px" }}>
        <h2
          style={{
            marginBottom: "20px",
            borderBottom: "2px solid #ccc",
            paddingBottom: "6px",
          }}
        >
          📷 写真
        </h2>

        {photoItems.length === 0 ? (
          <p style={{ color: "#666" }}>写真がありません。</p>
        ) : (
          <GalleryPhotoLightbox photos={photoItems} />
        )}
      </section>

      {/* ✅ 動画コーナー（埋め込み） */}
      <section>
        <h2
          style={{
            marginBottom: "20px",
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
                <div key={`v-${idx}`}>
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