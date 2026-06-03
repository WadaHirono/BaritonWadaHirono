import Link from "next/link";
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

  // ✅ 月ごとにグループ化
  const grouped: Record<string, any[]> = {};

  concerts.forEach((concert: any) => {
    const d = new Date(concert.date + "T00:00:00");
    const key = `${d.getFullYear()}年${d.getMonth() + 1}月`;

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(concert);
  });

  return (
    <main style={{ marginLeft: "220px" }}>
      {/* ヒーロー */}
      <div
        style={{
          position: "relative",
          height: "300px",
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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

      <div style={{ padding: "40px" }}>
        {/* お知らせ */}
        <section style={{ marginBottom: "40px" }}>
          <h2>お知らせ</h2>
          <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "10px" }}>
            最新の公演情報を更新しました。
          </div>
        </section>

        {/* SNS */}
        <section style={{ marginBottom: "40px" }}>
          <h2>SNS</h2>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="https://x.com/WadaHironoBR" target="_blank">X</a>
            <a href="https://www.instagram.com/hirono_wada/" target="_blank">Instagram</a>
            <a href="https://www.youtube.com/@hironowada9166" target="_blank">YouTube</a>
          </div>
        </section>

        {/* 公演情報 */}
        <section>
          <h2>公演情報</h2>

          {concerts.length === 0 && <p>現在予定されている公演はありません。</p>}

          {Object.entries(grouped).map(([month, list]) => (
            <div key={month} style={{ marginBottom: "40px" }}>
              <h3>{month}</h3>

              {list.map((concert: any) => (
                <div key={concert._id} style={{ marginBottom: "15px" }}>
                  <Link href={`/concert/${concert.slug?.current}`}>
                    <h4>{concert.title}</h4>
                  </Link>

                  <p style={{ color: "#666" }}>
                    {new Date(concert.date + "T00:00:00").toLocaleDateString("ja-JP")}
                  </p>

                  <p>{concert.venue}</p>
                </div>
              ))}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}