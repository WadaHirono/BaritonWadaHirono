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
    <main className="main">

      {/* ✅ ヒーロー */}
      <div className="hero">
        <div className="overlay" />
        <div className="heroText">
          <h1>和田広野</h1>
          <p>Hirono Wada</p>
          <p>バリトン歌手</p>
        </div>
      </div>

      <div className="container">

        {/* ✅ SNS */}
        <section>
          <h2>SNS</h2>
          <div className="sns">

            <a href="https://x.com/WadaHironoBR" target="_blank">
              <svg width="32" viewBox="0 0 24 24">
                <path d="M3 3h4l5 7 5-7h4l-7 10 8 11h-4l-6-8-6 8H3l8-11-7-10z"/>
              </svg>
            </a>

            <a href="https://www.instagram.com/hirono_wada/" target="_blank">
              <svg width="32" viewBox="0 0 24 24" fill="#E4405F">
                <path d="M7 2C4 2 2 4 2 7v10c0 3 2 5 5 5h10c3 0 5-2 5-5V7c0-3-2-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10z"/>
              </svg>
            </a>

            <a href="https://www.youtube.com/@hironowada9166" target="_blank">
              <svg width="32" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M21 8s-1-3-3-3c-2-1-6-1-6-1s-4 0-6 1C4 5 3 8 3 8s-1 3-1 4 0 4 0 4 1 3 3 3c2 1 6 1 6 1s4 0 6-1c2-1 3-3 3-3s1-3 1-4 0-4 0-4z"/>
              </svg>
            </a>

          </div>
        </section>

        {/* ✅ 公演カード */}
        <section>
          <h2>公演情報</h2>

          {concerts.length === 0 && <p>公演がまだありません。</p>}

          <div className="grid">
            {concerts.map((c: any) => (
              <Link key={c._id} href={`/concert/${c.slug?.current}`}>
                <div className="card">
                  <h3>{c.title}</h3>
                  <p>{new Date(c.date).toLocaleDateString("ja-JP")}</p>
                  <p>{c.venue}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* ✅ CSS */}
      <style jsx>{`
        .main {
          margin-left: 220px;
        }

        .container {
          padding: 40px;
        }

        .hero {
          height: 300px;
          background-image: url('/hero.jpg');
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
        }

        .heroText {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #fff;
          text-align: center;
        }

        .sns {
          display: flex;
          gap: 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px,1fr));
          gap: 20px;
        }

        .card {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 10px;
        }

        /* ✅ スマホ対応 */
        @media (max-width: 768px) {
          .main {
            margin-left: 0;
          }

          .container {
            padding: 20px;
          }
        }
      `}</style>
    </main>
  );
}