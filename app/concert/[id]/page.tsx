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
  params: Promise<{ id: string }>;
}) {
  // ✅ ここが最重要（必ずawait）
  const { id: slug } = await params;

  // ✅ slugがないとき
  if (!slug) {
    return (
      <main style={{ padding: "40px" }}>
        <p>URLが正しくありません。</p>
      </main>
    );
  }

  let concert: Concert | null = null;

  try {
    // ✅ Sanity取得（安全版）
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
    // ✅ fetch失敗でも落とさない
    return (
      <main style={{ padding: "40px" }}>
        <p>データ取得に失敗しました。</p>
      </main>
    );
  }

  // ✅ データ無い場合
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
      <h1 style={{ marginBottom: "10px" }}>
        {concert.title ?? "公演情報"}
      </h1>

      {/* ✅ 日付 */}
      {concert.date && (
        <p style={{ color: "#666" }}>
          {new Date(concert.date).toLocaleDateString("ja-JP")}
        </p>
      )}

      {/* ✅ 会場 */}
      {concert.venue && <p>{concert.venue}</p>}

      {/* ✅ ギャラリー（完全安全） */}
      <ConcertLightboxGallery
        title={concert.title ?? ""}
        mainImage={concert.mainImage ?? null}
        gallery={Array.isArray(concert.gallery) ? concert.gallery : []}
      />

      {/* ✅ 説明 */}
      {concert.description && (
        <p style={{ whiteSpace: "pre-line" }}>
          {concert.description}
        </p>
      )}

      {/* ✅ 料金 */}
      {concert.price && <p>{concert.price}</p>}

      {/* ✅ チケット */}
      {concert.ticketUrl && (
        <a
          href={concert.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          🎫 チケット購入
        </a>
      )}

      {/* ✅ 地図 */}
      {concert.mapUrl && (
        <iframe
          src={concert.mapUrl}
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
        />
      )}
    </main>
  );
}