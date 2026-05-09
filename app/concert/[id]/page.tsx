export const dynamic = "force-dynamic";

import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

export default async function ConcertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;

  const concert = await client.fetch(
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
      gallery[]
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
      {/* ✅ タイトル */}
      <h1 style={{ fontSize: "30px", marginBottom: "15px" }}>
        {concert.title}
      </h1>

      {/* ✅ 日付 */}
      {concert.date && (
        <p style={{ color: "#666", marginBottom: "5px" }}>
          {new Date(concert.date).toLocaleDateString("ja-JP")}
        </p>
      )}

      {/* ✅ 会場 */}
      {concert.venue && (
        <p style={{ marginBottom: "20px" }}>{concert.venue}</p>
      )}

      {/* ✅ メイン画像（表） */}
      {concert.mainImage && (
        <img
          src={urlFor(concert.mainImage).width(1000).url()}
          alt={concert.title}
          style={{
            width: "100%",
            borderRadius: "12px",
            marginBottom: "30px",
          }}
        />
      )}

      {/* ✅ サブ画像（裏・複数） */}
      {concert.gallery?.length > 0 && (
        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ marginBottom: "15px" }}>関連画像</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {concert.gallery.map((img: any, index: number) => (
              <img
                key={index}
                src={urlFor(img).width(800).url()}
                alt={`${concert.title} サブ画像 ${index + 1}`}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ✅ 説明 */}
      {concert.description && (
        <p
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.8",
            marginBottom: "20px",
          }}
        >
          {concert.description}
        </p>
      )}

      {/* ✅ 料金 */}
      {concert.price && (
        <p style={{ fontWeight: "bold", marginBottom: "20px" }}>
          {concert.price}
        </p>
      )}

      {/* ✅ チケットリンク */}
      {concert.ticketUrl && (
        <div style={{ marginBottom: "30px" }}>
          <a
            href={concert.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              background: "#000",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            🎫 チケットを購入
          </a>
        </div>
      )}

      {/* ✅ 地図 */}
      {concert.mapUrl && (
        <div>
          <h2 style={{ marginBottom: "10px" }}>会場案内</h2>
          <iframe
            src={concert.mapUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      )}
    </main>
  );
}