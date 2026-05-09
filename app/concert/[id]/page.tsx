export default async function ConcertDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const slug = params.id;

  // 👇 ここを安全に書く
  if (!slug) {
    return (
      <main style={{ padding: "40px" }}>
        <p>URLが正しくありません。</p>
      </main>
    );
  }

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

  // ✅ ここも重要（null対策）
  if (!concert) {
    return (
      <main style={{ padding: "40px" }}>
        <p>データが見つかりませんでした。</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px" }}>
      <h1>{concert.title}</h1>

      {/* ✅ クラッシュ防止 */}
      <ConcertLightboxGallery
        title={concert.title}
        mainImage={concert.mainImage ?? null}
        gallery={concert.gallery ?? []}
      />
    </main>
  );
}