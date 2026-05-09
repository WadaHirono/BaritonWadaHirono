export const dynamic = "force-dynamic";

import { client } from "@/lib/sanity";
import ConcertLightboxGallery from "@/components/ConcertLightboxGallery";

type ParamsType = { id: string };

export default async function ConcertDetailPage({
  params,
}: {
  params: ParamsType | Promise<ParamsType>;
}) {
  // ✅ Promiseでもオブジェクトでも対応
  const resolvedParams =
    typeof (params as any)?.then === "function"
      ? await params
      : params;

  const slug = (resolvedParams as { id?: string })?.id;

  if (!slug) {
    return (
      <main style={{ padding: "40px" }}>
        <p>URLが正しくありません。</p>
      </main>
    );
  }

  let concert = null;

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
      
      <h1>{concert.title ?? "公演情報"}</h1>

      {concert.date && (
        <p>
          {new Date(concert.date).toLocaleDateString("ja-JP")}
        </p>
      )}

      {concert.venue && <p>{concert.venue}</p>}

      <ConcertLightboxGallery
        title={concert.title ?? ""}
        mainImage={concert.mainImage ?? null}
        gallery={Array.isArray(concert.gallery) ? concert.gallery : []}
      />
    </main>
  );
}