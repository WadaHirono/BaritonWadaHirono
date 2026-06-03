import Link from "next/link";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  const concerts = await client.fetch(
    `*[_type == "concert" && dateTime(date) >= dateTime(now() - 1d)]
     | order(date asc){
      ...,
      "mainImage": coalesce(mainImage, image)
     }`
  );

  // ✅ 月ごとにグループ化
  const grouped: Record<string, any[]> = {};

  concerts.forEach((concert: any) => {
    const d = new Date(concert.date + "T00:00:00"); // ✅ ズレ防止
    const key = `${d.getFullYear()}年${d.getMonth() + 1}月`;

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(concert);
  });

  const nameJa = "和田広野";
  const nameEn = "Hirono Wada";

  return (
    <main>
      {/* ヒーロー */}
      <div
        style={{
          position: "relative",
          height: "300px",
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
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
          <h1 style={{ fontSize: "36px" }}>{nameJa}</h1>
          <p>{nameEn}</p>
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

        {/* ✅ 公演情報（進化版） */}
        <section>
          <h2>公演情報</h2>

          {concerts.length === 0 && <p>現在予定されている公演はありません。</p>}

          {Object.entries(grouped).map(([month, list]) => (
            <div key={month} style={{ marginBottom: "40px" }}>
              {/* 月見出し */}
              <h3 style={{ borderBottom: "2px solid #ddd" }}>{month}</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                  marginTop: "15px",
                }}
              >
                {list.map((concert: any) => (
                  <Link
                    key={concert._id}
                    href={`/concert/${concert.slug?.current}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {concert.mainImage && (
                        <img
                          src={urlFor(concert.mainImage).width(600).url()}
                          alt={concert.title}
                          style={{
                            width: "100%",
                            height: "160px",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      <div style={{ padding: "12px" }}>
                        <h4>{concert.title}</h4>

                        <p style={{ color: "#666" }}>
                          {new Date(concert.date + "T00:00:00").toLocaleDateString("ja-JP")}
                        </p>

                        {concert.venue && <p>{concert.venue}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}