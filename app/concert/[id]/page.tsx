export const dynamic = "force-dynamic";

import { client } from "@/lib/sanity";
import ConcertLightboxGallery from "@/components/ConcertLightboxGallery";

export default async function ConcertDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const slug = params.id;

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
      
      <h1 style={{ fontSize: "30px", marginBottom: "15px" }}>
        {concert.title}
      </h1>

      {concert.date && (
        <p style={{ color: "#666" }}>
          {new Date(concert.date).toLocaleDateString("ja-JP")}
        </p>
      )}

      {concert.venue && <p>{concert.venue}</p>}

      {/* ✅ ギャラリー */}
      <ConcertLightboxGallery
        title={concert.title}
        mainImage={concert.mainImage}
        gallery={concert.gallery}
      />

      {concert.description && (
        <p style={{ whiteSpace: "pre-line" }}>
          {concert.description}
        </p>
      )}

      {concert.price && <p>{concert.price}</p>}

      {concert.ticketUrl && (
        <a href={concert.ticketUrl} target="_blank">
          🎫 チケット購入
        </a>
      )}

      {concert.mapUrl && (
        <iframe
          src={concert.mapUrl}
          width="100%"
          height="300"
        />
      )}
    </main>
  );
}