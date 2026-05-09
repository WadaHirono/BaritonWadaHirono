import Link from "next/link";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

export default async function Home() {
  const concerts = await client.fetch(
    `*[_type == "concert"] | order(date asc){
      ...,
      "mainImage": coalesce(mainImage, image)
    }`
  );

  return (
    <main>

      {/* ✅ ヒーロー画像 */}
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
          <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
            和田広野
          </h1>
          <p style={{ fontSize: "18px" }}>
            バリトン歌手
          </p>
        </div>
      </div>

      <div style={{ padding: "40px" }}>

        {/* お知らせ */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "10px" }}>お知らせ</h2>
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
          <h2 style={{ marginBottom: "20px" }}>公演情報</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {concerts
              .filter((concert: any) => concert.slug?.current)
              .map((concert: any) => (
                <Link
                  key={concert._id}
                  href={`/concert/${concert.slug.current}`}
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
                    {/* ✅ メイン画像（NEW！） */}
                    {concert.mainImage && (
                      <img
                        src={urlFor(concert.mainImage).width(300).url()}
                        alt={concert.title}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <div style={{ padding: "15px" }}>
                      <h3>{concert.title}</h3>

                      <p style={{ color: "#666" }}>
                        {new Date(concert.date).toLocaleDateString("ja-JP")}
                      </p>

                      <p>{concert.venue}</p>
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