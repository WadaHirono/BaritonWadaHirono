export const dynamic = "force-dynamic";

import ConcertLightboxGallery from "@/components/ConcertLightboxGallery";
import { client } from "@/lib/sanity";

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

      // ✅ captionも使うので明示（captionを使わないなら gallery[] でもOK）
      gallery[]{..., caption}
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

      {/* ✅ 画像：クリック拡大 + サムネ中央寄せ */}
      <ConcertLightboxGallery
        title={concert.title}
        mainImage={concert.mainImage}
        gallery={concert.gallery}
      />

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