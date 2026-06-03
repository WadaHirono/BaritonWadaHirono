import Link from "next/link";
import { client } from "@/lib/sanity";

export default async function Home() {
  const concerts = await client.fetch(`
    *[_type == "concert" && date >= now()]
    | order(date asc){
      _id,
      title,
      date,
      venue,
      slug
    }
  `);

  return (
    <main style={{ marginLeft: "220px" }}>
      {/* ヒーロー */}
      <div
        style={{
          height: "300px",
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div style={{ padding: "40px" }}>
        {/* お知らせ */}
        <section style={{ marginBottom: "40px" }}>
          <h2>お知らせ</h2>
          <div
            style={{
              background: "#f5f5f5",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            最新の公演情報を更新しました。
          </div>
        </section>

        {/* 公演情報 */}
        <section>
          <h2>公演情報</h2>

          {concerts.length === 0 && <p>公演はありません。</p>}

          {concerts.map((c: any) => (
            <div key={c._id} style={{ marginBottom: "20px" }}>
              {c.slug?.current ? (
                <Link href={`/concert/${c.slug.current}`}>
                  <h3 style={{ cursor: "pointer" }}>{c.title}</h3>
                </Link>
              ) : (
                <h3>{c.title}</h3>
              )}

              <p style={{ color: "#666" }}>
                {new Date(c.date).toLocaleDateString("ja-JP")}
              </p>

              <p>{c.venue}</p>
            </div>
          ))}
        </section>
      </div>

      {/* スマホ */}
      <style>
        {`
        @media (max-width: 768px) {
          main {
            margin-left: 0 !important;
          }
        }
      `}
      </style>
    </main>
  );
}