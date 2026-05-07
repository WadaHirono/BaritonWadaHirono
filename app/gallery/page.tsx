import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

type GalleryDoc = {
  _id: string;
  title?: string;
  images?: any[];   // Sanity image array items
  videos?: string[]; // URL array
};

function toYouTubeEmbed(url: string) {
  // YouTube: watch?v= / youtu.be / shorts / embed をなるべく吸収して embed URL にする
  try {
    const u = new URL(url);

    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    // youtube.com/watch?v=<id>
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;

      // youtube.com/shorts/<id>
      const parts = u.pathname.split("/").filter(Boolean);
      const shortsIndex = parts.indexOf("shorts");
      if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[shortsIndex + 1]}`;
      }

      // youtube.com/embed/<id>
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
  const items: GalleryDoc[] = await client.fetch(
    `*[_type == "gallery"] | order(_createdAt desc){
      _id,
      title,
      images,
      videos
    }`
  );

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>写真・動画</h1>

      <div style={{ display: "grid", gap: "28px" }}>
        {items.map((doc) => (
          <section
            key={doc._id}
            style={{
              border: "1px solid #eee",
              borderRadius: "16px",
              padding: "18px",
              background: "#fff",
              boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
            }}
          >
            {doc.title && (
              <h2 style={{ fontSize: "18px", margin: "0 0 14px 0" }}>
                {doc.title}
              </h2>
            )}

            {/* ✅ 画像（複数） */}
            {doc.images?.length ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                  marginBottom: doc.videos?.length ? "18px" : "0",
                }}
              >
                {doc.images.map((img: any, idx: number) => (
                  <img
                    key={img?._key ?? idx}
                    src={urlFor(img).width(800).auto("format").url()}
                    alt={doc.title ?? `gallery-image-${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                ))}
              </div>
            ) : null}

            {/* ✅ 動画（複数） */}
            {doc.videos?.length ? (
              <div style={{ display: "grid", gap: "14px" }}>
                {doc.videos.map((v, idx) => {
                  const embed = toYouTubeEmbed(v);
                  return (
                    <div key={`${doc._id}-video-${idx}`}>
                      {embed ? (
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            paddingTop: "56.25%", // 16:9
                            borderRadius: "12px",
                            overflow: "hidden",
                            background: "#000",
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
                          href={v}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-block",
                            color: "#0070f3",
                            textDecoration: "underline",
                            wordBreak: "break-word",
                          }}
                        >
                          🎬 動画リンクを開く
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* 何も無い場合 */}
            {!doc.images?.length && !doc.videos?.length && (
              <p style={{ color: "#666", margin: 0 }}>コンテンツがありません。</p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}