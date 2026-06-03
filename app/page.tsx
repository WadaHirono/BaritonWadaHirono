import Link from "next/link";
import { client } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export default async function Home() {
  const concerts = await client.fetch(
    `*[_type == "concert" && dateTime(date) >= now() - 60*60*24]
     | order(date asc){
      _id, title, date, venue, slug
     }`
  );

  return (
    <main style={{ marginLeft: "220px" }}>
      
      {/* ✅ ヒーロー */}
      <div
        style={{
          height: "300px",
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)"
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            textAlign: "center"
          }}
        >
          <h1>和田広野</h1>
          <p>Hirono Wada</p>
          <p>バリトン歌手</p>
        </div>
      </div>

      <div style={{ padding: "40px" }}>

        {/* ✅ SNS */}
        <section style={{ marginBottom: "40px" }}>
          <h2>SNS</h2>

          <div style={{ display: "flex", gap: "20px" }}>
            <a href="https://x.com/WadaHironoBR" target="_blank">
              <svg width="32" viewBox="0 0 24 24">
                <path d="M3 3h4l5 7 5-7h4l-7 10 8 11h-4l-6-8-6 8H3l8-11-7-10z"/>
              </svg>
            </a>

            <a href="https://www.instagram.com/hirono_wada/" target="_blank">
              <svg width="32" fill="#E4405F" viewBox="0 0 24 24">
                <path d="M7 2C4 2 2 4 2 7v10c0 3 2 5 5 5h10c3 0 5-2 5-5V7c0-3-2-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10z"/>
              </svg>
            </a>

            <a href="https://www.youtube.com/@hironowada9166" target="_blank">
              <svg width="32" fill="#FF0000" viewBox="0 0 24 24">
                <path d="M21 8s-1-3-3-3c-2-1-6-1-6-1s-4 0-6 1C4 5 3 8 3 8s-1 3-1 4 0 4 0 4 1 3 3 3c2 1 6 1 6 1s4 0 6-1c2-1 3-3 3-3s1-3 1-4 0-4 0-4z"/>
              </svg>
            </a>
          </div>
        </section>

        {/* ✅ 公演 */}
        <section>
          <h2>公演情報</h2>

          {concerts.length === 0 && <p>公演がまだありません。</p>}

          {concerts.map((c: any) => (
            <div key={c._id} style={{ marginBottom: "15px" }}>
              {c.slug?.current ? (
                <Link href={`/concert/${c.slug.current}`}>
                  <h3>{c.title}</h3>
                </Link>
              ) : (
                <h3>{c.title}</h3>
              )}

              <p>
                {new Date(c.date + "T00:00:00").toLocaleDateString("ja-JP")}
              </p>

              <p>{c.venue}</p>
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}