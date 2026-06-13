export const dynamic = "force-dynamic";
export const revalidate = 60;

import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import GalleryPhotoLightbox from "@/components/GalleryPhotoLightbox";

type GalleryDoc = {
  _id: string;
  title?: string;
  images?: any[];
  image?: any;
  videos?: string[];
};

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
    items = await client.fetch(`
      *[_type == "gallery"] | order(_createdAt desc){
        _id,
        title,
        image,
        images,
        videos
      }
    `);
  } catch {
    return (
      <main style={{ padding: "40px" }}>
        <h1>写真・動画</h1>
        <p>データ取得に失敗しました。</p>
      </main>
    );
  }

  const allPhotos = items.flatMap((d) => {
    const arr = [];
    if (d.image) arr.push(d.image);
    if (Array.isArray(d.images)) arr.push(...d.images);
    return arr;
  });

  const photoItems = allPhotos
    .filter(Boolean)
    .map((img: any, idx: number) => {
      const caption = img?.caption;
      return {
        thumbSrc: urlFor(img).width(800).height(500).fit("crop").auto("format").url(),
        fullSrc: urlFor(img).width(1600).auto("format").url(),
        alt: caption
          ? `写真 ${idx + 1}（${caption}）`
          : `写真 ${idx + 1}`,
        caption,
      };
    });

  const allVideos = items.flatMap((d) =>
    Array.isArray(d.videos) ? d.videos : []
  );

  return (
    <main className="page">
      <div className="inner">
        <h1 className="pageTitle">写真・動画</h1>

        {/* 写真 */}
        <section className="section">
          <h2 className="sectionTitle">📷 写真</h2>

          {photoItems.length === 0 ? (
            <p className="empty">写真がありません。</p>
          ) : (
            <GalleryPhotoLightbox photos={photoItems} />
          )}
        </section>

        {/* 動画 */}
        <section className="section">
          <h2 className="sectionTitle">🎥 動画</h2>

          {allVideos.length === 0 ? (
            <p className="empty">動画がありません。</p>
          ) : (
            <div className="videoGrid">
              {allVideos.map((url, idx) => {
                if (!url) return null;
                const embed = toEmbedUrl(url);

                return (
                  <div key={idx}>
                    {embed ? (
                      <div className="videoWrap">
                        <iframe
                          src={embed}
                          title={`video-${idx}`}
                          loading="lazy"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        🎬 動画リンクを開く
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .page {
          margin-left: 220px;
          min-height: 100vh;
          background: #faf8f4;
        }

        /* ✅ ここが重要（余白調整の本体） */
        .inner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 40px 40px 60px;
        }

        .pageTitle {
          font-size: 28px;
          margin-bottom: 30px;
        }

        .section {
          margin-bottom: 60px;
        }

        .sectionTitle {
          border-bottom: 2px solid #ccc;
          margin-bottom: 20px;
          padding-bottom: 6px;
        }

        .videoGrid {
          display: grid;
          gap: 20px;
        }

        .videoWrap {
          position: relative;
          padding-top: 56.25%;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
        }

        .videoWrap iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .empty {
          color: #666;
        }

        /* ✅ スマホ対応 */
        @media (max-width: 768px) {
          .page {
            margin-left: 0 !important;
          }

          .inner {
            padding: 24px 16px 40px;
          }

          .pageTitle {
            font-size: 24px;
          }
        }
      `}</style>
    </main>
  );
}