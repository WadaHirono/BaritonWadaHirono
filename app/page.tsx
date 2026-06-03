import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const concerts = await client.fetch(
    `*[_type == "concert" && dateTime(date) >= now()]
     | order(date asc){
      _id,
      title,
      date,
      venue,
      slug,
      "mainImage": coalesce(mainImage, image)
     }`
  );

  return (
    <main style={{ marginLeft: "220px" }}>
      
      {/* ✅ ヒーロー */}
      <div style={{ position: "relative", height: "300px" }}>
        <Image
          src="/hero.jpg"
          alt="hero"
          fill
          style={{ objectFit: "cover" }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <h1>和田広野</h1>
          <p>Hirono Wada</p>
          <p>バリトン歌手</p>
        </div>
      </div>

      <div style={{ padding: 40 }}>

        {/* ✅ お知らせ */}
        <section style={{ marginBottom: 40 }}>
          <h2>お知らせ</h2>
          <div style={{ background: "#f5f5f5", padding: 15 }}>
            最新の公演情報を更新しました。
          </div>
        </section>

        {/* ✅ SNS（SVG） */}
        <section style={{ marginBottom: 40 }}>
          <h2>SNS</h2>

          <div style={{ display: "flex", gap: 20 }}>

            <a href="https://x.com/WadaHironoBR" target="_blank">
              <svg width="32" height="32" viewBox="0 0 24 24">
                <path d="M3 3h4l5 7 5-7h4l-7 10 8 11h-4l-6-8-6 8H3l8-11-7-10z"/>
              </svg>
            </a>

            <a href="https://www.instagram.com/hirono_wada/" target="_blank">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#E4405F">
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5z"/>
              </svg>
            </a>

            <a href="https://www.youtube.com/@hironowada9166" target="_blank">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M21.8 8s-.2-1.5-.8-2.2c-.7-.7-1.5-.7-1.9-.8C16.3 4.8 12 4.8 12 4.8s-4.3 0-7.1.2c-.4 0-1.2.1-1.9.8C2.4 6.5 2.2 8 2.2 8S2 9.7 2 11.5v1c0 1.8.2 3.5.2 3.5s.2 1.5.8 2.2c.7.7 1.6.7 2 .8 1.5.1 6.3.2 6.3.2s4.3 0 7.1-.2c.4 0 1.2-.1 1.9-.8.6-.7.8-2.2.8-2.2s.2-1.7.2-3.5v-1C22 9.7 21.8 8 21.8 8z"/>
              </svg>
            </a>
          </div>
        </section>

        {/* ✅ 公演カード */}
        <section>
          <h2>公演情報</h2>

          {concerts.length === 0 && <p>公演がまだありません。</p>}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
              gap: "20px",
              marginTop: 20,
            }}
          >
            {concerts.map((c: any) => (
              <Link
                key={c._id}
                href={`/concert/${c.slug?.current}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  {c.mainImage && (
                    <img
                      src={urlFor(c.mainImage).width(600).url()}
                      alt=""
                      style={{ width: "100%", height: 150, objectFit: "cover" }}
                    />
                  )}

                  <div style={{ padding: 12 }}>
                    <h3>{c.title}</h3>
                    <p style={{ color: "#666" }}>
                      {new Date(c.date + "T00:00:00").toLocaleDateString("ja-JP")}
                    </p>
                    <p>{c.venue}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}