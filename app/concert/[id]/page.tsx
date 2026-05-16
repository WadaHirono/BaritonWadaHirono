export const dynamic = "force-dynamic";

import { client } from "@/lib/sanity";
import ConcertLightboxGallery from "@/components/ConcertLightboxGallery";

type ParamsType = { id: string };

type Concert = {
  title?: string;
  date?: string;
  venue?: string;
  description?: string;
  price?: string;
  ticketUrl?: string;
  mapUrl?: string;
  website?: string;
  organizer?: string; // ✅ 追加
  role?: string;       // ✅ 追加
  detailPageUrl?: string; // ✅ 追加
  mainImage?: any;
  gallery?: any[];
};

export default async function ConcertDetailPage({
  params,
}: {
  params: ParamsType | Promise<ParamsType>;
}) {
  const resolvedParams =
    typeof (params as any)?.then === "function"
      ? await params
      : params;

  const slug = (resolvedParams as any)?.id;

  if (!slug) {
    return (
      <main style={{ padding: "40px" }}>
        <p>URLが正しくありません。</p>
      </main>
    );
  }

  let concert: Concert | null = null;

  try {
    concert = await client.fetch(
      `*[_type == "concert" && slug.current == $slug][0]{
        title,
        date,
        venue,
        description,
        price,
        ticketUrl,
        mapUrl,
        website,
        organizer,       // ✅ 追加
        role,            // ✅ 追加
        detailPageUrl,   // ✅ 追加
        "mainImage": coalesce(mainImage, image),
        gallery[]
      }`,
      { slug }
    );
  } catch {
    return (
      <main style={{ padding: "40px" }}>
        <p>データ取得に失敗しました。</p>
      </main>
    );
  }

  if (!concert) {
    return (
      <main style={{ padding: "40px" }}>
        <p>データが見つかりませんでした。</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px" }}>
      
      {/* タイトル */}
      <h1 style={{ marginBottom: "10px" }}>
        {concert.title ?? "公演情報"}
      </h1>

      {/* 日付・会場 */}
      {concert.date && (
        <p style={{ color: "#666" }}>
          {new Date(concert.date).toLocaleDateString("ja-JP")}
        </p>
      )}
      {concert.venue && (
        <p style={{ marginBottom: "10px" }}>
          {concert.venue}
        </p>
      )}

      {/* ✅ 新情報（ここ追加） */}
      {concert.organizer && (
        <p style={{ color: "#444" }}>
          【主催】{concert.organizer}
        </p>
      )}
      {concert.role && (
        <p style={{ marginBottom: "15px" }}>
          【出演】{concert.role}
        </p>
      )}

      {/* 画像 */}
      <ConcertLightboxGallery
        title={concert.title ?? ""}
        mainImage={concert.mainImage ?? null}
        gallery={Array.isArray(concert.gallery) ? concert.gallery : []}
      />

      {/* 詳細 */}
      {concert.description && (
        <>
          <h2 style={{ marginTop: "30px" }}>コンサート詳細</h2>
          <p style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
            {concert.description}
          </p>
        </>
      )}

      {/* ✅ 公演詳細ページ（新） */}
      {concert.detailPageUrl && (
        <div style={{ marginTop: "20px" }}>
          <a
            href={concert.detailPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#0070f3",
              textDecoration: "underline",
            }}
          >
            ▶ 公演詳細ページはこちら
          </a>
        </div>
      )}

      {/* チケット料金 */}
      {concert.price && (
        <>
          <h2 style={{ marginTop: "30px" }}>チケット料金</h2>
          <p>{concert.price}</p>
        </>
      )}

      {/* 公演HP */}
      {concert.website && (
        <>
          <h2 style={{ marginTop: "30px" }}>公演HP</h2>
          <a href={concert.website} target="_blank" rel="noopener noreferrer">
            {concert.website}
          </a>
        </>
      )}

      {/* チケットボタン */}
      {concert.ticketUrl && (
        <div style={{ marginTop: "30px" }}>
          <a
            href={concert.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "#000",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            🎫 チケット購入
          </a>
        </div>
      )}

      {/* 地図 */}
      {concert.mapUrl && (
        <div style={{ marginTop: "30px" }}>
          <h2>会場地図</h2>
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