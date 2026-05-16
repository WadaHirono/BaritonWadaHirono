import Link from "next/link";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

// ✅ キャッシュ完全オフ（本番で更新されない対策）
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  const concerts = await client.fetch(
    `*[_type == "concert"] | order(date asc){
      ...,
      "mainImage": coalesce(mainImage, image)
    }`
  );

  // ✅ 名前（ローマ字）
  const nameJa = "和田広野";
  const nameEn = "Hirono Wada";

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
          <h1 style={{ fontSize: "36px", marginBottom: "5px" }}>{nameJa}</h1>

          <p style={{ fontSize: "16px", opacity: 0.85 }}>{nameEn}</p>

          <p style={{ fontSize: "18px", marginTop: "8px" }}>バリトン歌手</p>
        </div>
      </div>

      <div style={{ padding: "40px" }}>
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

        {/* ✅ SNS */}
        <section style={{ marginBottom: "40px" }}>
          <h2>SNS</h2>

          <div style={{ display: "flex", gap: "20px" }}>
            {/* X */}
            <a
              href="https://x.com/WadaHironoBR"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "black" }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h4l5 7 5-7h4l-7 10 8 11h-4l-6-8-6 8H3l8-11-7-10z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/hirono_wada/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#E4405F" }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm6.5-.7c.8 0 1.5.7 1.5 1.5S19.3 9 18.5 9 17 8.3 17 7.5 17.7 6.3 18.5 6.3zM12 9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@hironowada9166"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#FF0000" }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.8 8s-.2-1.5-.8-2.2c-.7-.7-1.5-.7-1.9-.8C16.3 4.8 12 4.8 12 4.8h0s-4.3 0-7.1.2c-.4 0-1.2.1-1.9.8C2.4 6.5 2.2 8 2.2 8S2 9.7 2 11.5v1c0 1.8.2 3.5.2 3.5s.2 1.5.8 2.2c.7.7 1.6.7 2 .8 1.5.1 6.3.2 6.3.2s4.3 0 7.1-.2c.4 0 1.2-.1 1.9-.8.6-.7.8-2.2.8-2.2s.2-1.7.2-3.5v-1C22 9.7 21.8 8 21.8 8zM10 14.5v-5l5 2.5-5 2.5z" />
              </svg>
            </a>
          </div>
        </section>

        {/* ✅ 公演情報 */}
        <section>
          <h2>公演情報</h2>

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
                    {concert.mainImage && (
                      <img
                        src={urlFor(concert.mainImage).width(600).url()}
                        alt={concert.title}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <div style={{ padding: "15px" }}>
                      <h3 style={{ margin: "0 0 8px" }}>{concert.title}</h3>

                      {concert.date && (
                        <p style={{ color: "#666", margin: "0 0 6px" }}>
                          {new Date(concert.date).toLocaleDateString("ja-JP")}
                        </p>
                      )}

                      {concert.venue && <p style={{ margin: 0 }}>{concert.venue}</p>}
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