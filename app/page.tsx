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
      
      {/* ✅ ヒーロー（確実に表示される最低構成） */}
      <div style={{ padding: "40px", background: "#222", color: "#fff" }}>
        <h1>和田広野</h1>
        <p>Hirono Wada</p>
        <p>バリトン歌手</p>
      </div>

      <div style={{ padding: "40px" }}>

        {/* ✅ SNS（まずテキストに戻す） */}
        <section style={{ marginBottom: "40px" }}>
          <h2>SNS</h2>
          <div>
            <p><a href="https://x.com/WadaHironoBR" target="_blank">X</a></p>
            <p><a href="https://www.instagram.com/hirono_wada/" target="_blank">Instagram</a></p>
            <p><a href="https://www.youtube.com/@hironowada9166" target="_blank">YouTube</a></p>
          </div>
        </section>

        {/* ✅ 公演情報 */}
        <section>
          <h2>公演情報</h2>

          {concerts.length === 0 && <p>公演がまだありません。</p>}

          {concerts.map((concert: any) => (
            <div key={concert._id} style={{ marginBottom: "15px" }}>
              <Link href={`/concert/${concert.slug?.current}`}>
                <h3>{concert.title}</h3>
              </Link>

              <p>{new Date(concert.date).toLocaleDateString("ja-JP")}</p>
              <p>{concert.venue}</p>
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}