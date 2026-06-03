import Link from "next/link";
import { client } from "@/lib/sanity";

export default async function Home() {
  const concerts = await client.fetch(
    `*[_type == "concert" && dateTime(date) >= now() - 60*60*24]
     | order(date asc){
      _id, title, date, venue, slug
     }`
  );

  return (
    <main
      style={{
        marginLeft: "220px",
      }}
    >
      {/* ✅ ヒーロー画像 */}
      <div
        style={{
          height: "300px",
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      />

      <div
        style={{
          padding: "40px",
        }}
      >
        {/* ✅ お知らせ */}
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

        {/* ✅ SNS（SVG） */}
        <section style={{ marginBottom: "40px" }}>
          <h2>SNS</h2>

          <div style={{ display: "flex", gap: "20px" }}>
            <a href="https://x.com/WadaHironoBR" target="_blank">
              <svg width="32" viewBox="0 0 24 24">
                <path d="M3 3h4l5 7 5-7h4l-7 10 8 11h-4l-6-8-6 8H3l8-11-7-10z" />
              </svg>
            </a>

            <a href="https://www.instagram.com/hirono_wada/" target="_blank">
              <svg width="32" fill="#E4405F" viewBox="0 0 24 24">
                <path d="M7 2C4 2 2 4 2 7v10c0 3 2 5 5 5h10c3 0 5-2 5-5V7c0-3-2-5-5-5H7z" />
              </svg>
            </a>

            <a href="https://www.youtube.com/@hironowada9166" target="_blank">
              <svg width="32" fill="#FF0000" viewBox="0 0 24 24">
                <path d="M21 8s-1-3-3-3c-2-1-6-1-6-1s-4 0-6 1C4 5 3 8 3 8s-1 3-1 4s0 4 0 4 1 3 3 3c2 1 6 1 6 1s4 0 6-1c2-1 3-3 3-3s1-3 1-4s0-4 0-4z" />
              </svg>
            </a>
          </div>
        </section>

        {/* ✅ 公演情報 */}
        <section>
          <h2>公演情報</h2>

          {concerts.length === 0 && <p>公演がまだありません。</p>}

          {concerts.map((c: any) => (
            <div key={c._id} style={{ marginBottom: "20px" }}>
              {c.slug?.current ? (
                <Link href={`/concert/${c.slug.current}`}>
                  <div>
                    <h3>{c.title}</h3>
                  </div>
                </Link>
              ) : (
                <h3>{c.title}</h3>
              )}

              <p style={{ color: "#666" }}>
                {new Date(c.date + "T00:00:00").toLocaleDateString("ja-JP")}
              </p>

              <p>{c.venue}</p>
            </div>
          ))}
        </section>
      </div>

      {/* ✅ スマホ対策 */}
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