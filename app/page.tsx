import Link from "next/link";
import { client } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export default async function Home() {
  const concerts = await client.fetch(
    `*[_type == "concert" && dateTime(date) >= now()]
     | order(date asc){
      _id,
      title,
      date,
      venue,
      slug
     }`
  );

  return (
    <main style={{ marginLeft: "220px" }}>
      
      {/* ✅ プロフィール */}
      <section style={{ padding: 40, textAlign: "center" }}>
        <h1>和田広野</h1>
        <p>Hirono Wada</p>
        <p>バリトン歌手</p>

        {/* ✅ プロフィール画像 */}
        <img
          src="/profile.jpg"
          alt="プロフィール"
          style={{ width: "200px", borderRadius: "50%", marginTop: "20px" }}
        />
      </section>

      <div style={{ padding: 40 }}>

        {/* ✅ お知らせ */}
        <section style={{ marginBottom: 40 }}>
          <h2>お知らせ</h2>
          <div style={{ background: "#f5f5f5", padding: 15 }}>
            最新の公演情報を更新しました。
          </div>
        </section>

        {/* ✅ SNS（SVGアイコン） */}
        <section style={{ marginBottom: 40 }}>
          <h2>SNS</h2>

          <div style={{ display: "flex", gap: 20 }}>
            
            {/* X */}
            <a href="https://x.com/WadaHironoBR" target="_blank">
              <svg width="32" height="32" fill="black" viewBox="0 0 24 24">
                <path d="M3 3h4l5 7 5-7h4l-7 10 8 11h-4l-6-8-6 8H3l8-11-7-10z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/hirono_wada/" target="_blank">
              <svg width="32" height="32" fill="#E4405F" viewBox="0 0 24 24">
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm6.5-.7c.8 0 1.5.7 1.5 1.5S19.3 9 18.5 9 17 8.3 17 7.5 17.7 6.3 18.5 6.3zM12 9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a href="https://www.youtube.com/@hironowada9166" target="_blank">
              <svg width="32" height="32" fill="#FF0000" viewBox="0 0 24 24">
                <path d="M21.8 8s-.2-1.5-.8-2.2c-.7-.7-1.5-.7-1.9-.8C16.3 4.8 12 4.8 12 4.8s-4.3 0-7.1.2c-.4 0-1.2.1-1.9.8C2.4 6.5 2.2 8 2.2 8S2 9.7 2 11.5v1c0 1.8.2 3.5.2 3.5s.2 1.5.8 2.2c.7.7 1.6.7 2 .8 1.5.1 6.3.2 6.3.2s4.3 0 7.1-.2c.4 0 1.2-.1 1.9-.8.6-.7.8-2.2.8-2.2s.2-1.7.2-3.5v-1C22 9.7 21.8 8 21.8 8zM10 14.5v-5l5 2.5-5 2.5z"/>
              </svg>
            </a>

          </div>
        </section>

        {/* ✅ 未来公演 */}
        <section>
          <h2>公演情報</h2>

          {concerts.length === 0 && <p>公演がまだありません。</p>}

          {concerts.map((c: any) => (
            <div key={c._id} style={{ marginBottom: 20 }}>
              {c.slug?.current ? (
                <Link href={`/concert/${c.slug.current}`}>
                  <h3>{c.title}</h3>
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
    </main>
  );
}