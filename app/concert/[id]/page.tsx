export const dynamic = "force-dynamic";

import { client } from "@/lib/sanity";
import ConcertLightboxGallery from "@/components/ConcertLightboxGallery";

type Concert = {
  _id: string;
  title?: string;
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
  params: { id: string };
}) {
  const slug = params?.id;

  // ✅ URLが壊れていても必ず表示を返す
  if (!slug) {
    return (
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>公演情報</h1>
        <p style={{ color: "#666" }}>URLが正しくありません。</p>
      </main>
    );
  }

  let concert: Concert | null = null;

  try {
    concert = await client.fetch(
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
  } catch (e) {
    // ✅ Sanity接続が落ちてもページは落とさない
    return (
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>公演情報</h1>
        <p style={{ color: "#b00020", marginBottom: "10px" }}>
          サーバー側でデータ取得に失敗しました。
        </p>
        <p style={{ color: "#666", lineHeight: 1.7 }}>
          もう一度読み込みをお試しください。改善しない場合は時間をおいて再度お試しください。
        </p>
      </main>
    );
  }

  // ✅ slugはあるが該当データが無い場合も落とさない
  if (!concert) {
    return (
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>公演情報</h1>
        <p style={{ color: "#666" }}>公演データが見つかりませんでした。</p>
      </main>
    );
  }

  const dateText =
    concert.date && !Number.isNaN(Date.parse(concert.date))
      ? new Date(concert.date).toLocaleDateString("ja-JP")
      : "";

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px" }}>
      {/* ✅ タイトル */}
      <h1 style={{ fontSize: "30px", marginBottom: "12px" }}>
        {concert.title ?? "公演情報"}
      </h1>

      {/* ✅ 日付・会場 */}
      {dateText && (
        <p style={{ color: "#666", marginBottom: "6px" }}>{dateText}</p>
      )}
      {concert.venue && <p style={{ marginBottom: "18px" }}>{concert.venue}</p>}

      {/* ✅ 画像（メイン＋サブ） */}
      <ConcertLightboxGallery
        title={concert.title ?? "concert"}
        mainImage={concert.mainImage ?? null}
        gallery={Array.isArray(concert.gallery) ? concert.gallery : []}
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
              padding: "12px 18px",
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
            style={{ border: 0, borderRadius: "10px" }}
            loading="lazy"
          />
        </div>
      )}
    </main>
  );
}