// wada-site / app/concert/[id]/page.tsx
export const dynamic = "force-dynamic";

import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

type ConcertDetail = {
  _id: string;
  title: string;
  date?: string;
  venue?: string;
  description?: string;
  price?: string;
  ticketUrl?: string;
  mapUrl?: string;

  mainImage?: any;
  gallery?: any[];
};

export default async function ConcertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;

  const concert: ConcertDetail | null = await client.fetch(
    `*[_type == "concert" && slug.current == $slug][0]{
      _id,
      title,
      date,
      venue,
      description,
      price,
      ticketUrl,
      mapUrl,

      "mainImage": coalesce(mainImage, image),
      "gallery": gallery[]
    }`,
    { slug }
  );

  if (!concert) {
    return (
      <main style={{ padding: "40px" }}>
        <p>データが見つかりませんでした。</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "18px" }}>{concert.title}</h1>

      {/* ✅ 日付・会場 */}
      <div style={{ color: "#666", marginBottom: "8px" }}>
        {concert.date ? new Date(concert.date).toLocaleDateString("ja-JP") : ""}
      </div>
      <div style={{ marginBottom: "18px" }}>{concert.venue}</div>

      {/* ✅ メイン画像（詳細の先頭） */}
      {concert.mainImage && (
        <img
          src={urlFor(concert.mainImage).width(1200).auto("format").url()}
          alt={concert.title}
          style={{
            width: "100%",
            borderRadius: "12px",
            marginBottom: "20px",
            objectFit: "cover",
          }}
        />
      )}

      {/* ✅ サブ画像（チラシ裏面など：複数） */}
      {concert.gallery?.length ? (
        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>関連画像</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {concert.gallery.map((img: any, idx: number) => (
              <img
                key={img?._key ?? idx}
                src={urlFor(img).width(900).auto("format").url()}
                alt={`${concert.title} サブ画像 ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid #eee",
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* ✅ 説明 */}
      {concert.description && (
        <div style={{ whiteSpace: "pre-line", lineHeight: "1.8", marginBottom: "16px" }}>
          {concert.description}
        </div>
      )}

      {/* ✅ 料金 */}
      {concert.price && (
        <p style={{ fontWeight: "bold", marginBottom: "20px" }}>{concert.price}</p>
      )}

      {/* ✅ チケット */}
      {concert.ticketUrl && (
        <div style={{ marginBottom: "26px" }}>
          <a
            href={concert.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#0070f3",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            🎫 チケットを購入
          </a>
        </div>
      )}

      {/* ✅ 地図 */}
      {concert.mapUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ marginBottom: "10px" }}>会場案内</h2>
          <iframe
            src={concert.mapUrl}
            width="100%"
            height="360"
            style={{ border: "0", borderRadius: "12px" }}
            loading="lazy"
          />
        </div>
      )}
    </main>
  );
}