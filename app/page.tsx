import Link from "next/link";
import { client } from "@/lib/sanity";

export const revalidate = 60;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Home() {
  const concerts = await client.fetch(`
    *[_type == "concert" && date >= now()]
    | order(date asc){
      _id,
      title,
      date,
      venue,
      slug,
      description,
      role,
      organizer,
      mainImage{
        asset->{
          url
        }
      }
    }
  `);

  return (
    <main className="page">
      {/* ヒーロー */}
      <section className="hero">
        <div className="heroOverlay">
          <p className="heroRoman">HIRONO WADA</p>
          <h1 className="heroName">和田 紘乃</h1>
          <p className="heroTitle">ピアニスト / クラシック音楽家</p>
          <p className="heroLead">
            演奏会情報、出演予定、公演詳細を掲載しています。
            最新情報は下記のSNSでもご覧いただけます。
          </p>

          <div className="heroButtons">
            <a href="#concerts" className="heroButton primary">
              公演情報を見る
            </a>
            <Link href="/past-concerts" className="heroButton secondary">
              過去公演を見る
            </Link>
          </div>
        </div>
      </section>

      <div className="content">
        {/* お知らせ */}
        <section className="section">
          <h2 className="sectionTitle">お知らせ</h2>
          <div className="noticeBox">
            最新の公演情報を更新しました。出演予定の詳細は各公演カードをクリックしてください。
          </div>
        </section>

        {/* プロフィール */}
        <section className="section">
          <h2 className="sectionTitle">プロフィール</h2>
          <div className="profileCard">
            <div>
              <p className="profileRoman">HIRONO WADA</p>
              <h3 className="profileName">和田 紘乃</h3>
              <p className="profileRole">ピアニスト / クラシック音楽家</p>
            </div>
            <p className="profileText">
              ソロ、室内楽、伴奏など幅広い演奏活動を行い、各地のステージに出演。
              本サイトでは出演情報や過去公演、関連リンクをまとめてご案内しています。
            </p>
          </div>
        </section>

        {/* SNS */}
        <section className="section">
          <h2 className="sectionTitle">SNS</h2>
          <div className="snsList">
            <a
              href="https://x.com/WadaHironoBR"
              target="_blank"
              rel="noopener noreferrer"
              className="snsButton x"
              aria-label="X"
            >
              <svg viewBox="0 0 24 24" className="snsIcon" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.639 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932L18.901 1.153Zm-1.291 19.492h2.039L6.486 3.244H4.298L17.61 20.645Z"
                />
              </svg>
              <span>X</span>
            </a>

            <a
              href="https://www.instagram.com/hirono_wada/"
              target="_blank"
              rel="noopener noreferrer"
              className="snsButton instagram"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" className="snsIcon" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.75 1.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.5 5.5 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4Z"
                />
              </svg>
              <span>Instagram</span>
            </a>

            <a
              href="https://www.youtube.com/@hironowada9166"
              target="_blank"
              rel="noopener noreferrer"
              className="snsButton youtube"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" className="snsIcon" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M23.498 6.186a2.999 2.999 0 0 0-2.11-2.121C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.565A2.999 2.999 0 0 0 .502 6.186 31.724 31.724 0 0 0 0 12a31.724 31.724 0 0 0 .502 5.814 2.999 2.999 0 0 0 2.11 2.121C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.565a2.999 2.999 0 0 0 2.11-2.121A31.724 31.724 0 0 0 24 12a31.724 31.724 0 0 0-.502-5.814ZM9.75 15.568V8.432L15.818 12 9.75 15.568Z"
                />
              </svg>
              <span>YouTube</span>
            </a>
          </div>
        </section>

        {/* 今後の公演 */}
        <section className="section" id="concerts">
          <div className="sectionHeader">
            <h2 className="sectionTitle">今後の公演情報</h2>
            <Link href="/past-concerts" className="pastLink">
              過去公演はこちら →
            </Link>
          </div>

          {concerts.length === 0 && <p>公演はありません。</p>}

          {concerts.length > 0 && (
            <div className="concertGrid">
              {concerts.map((c: any) => (
                <Link
                  key={c._id}
                  href={c.slug?.current ? `/concert/${c.slug.current}` : "#"}
                  className="concertCard"
                >
                  <div className="imageWrap">
                    {c.mainImage?.asset?.url ? (
                      <img
                        src={c.mainImage.asset.url}
                        alt={c.title}
                        className="concertImage"
                      />
                    ) : (
                      <div className="noImage">NO IMAGE</div>
                    )}
                  </div>

                  <div className="concertBody">
                    <p className="concertDate">{formatDate(c.date)}</p>
                    <h3 className="concertTitle">{c.title}</h3>
                    <p className="concertVenue">{c.venue}</p>

                    {(c.role || c.organizer) && (
                      <div className="concertMeta">
                        {c.role && <p>出演: {c.role}</p>}
                        {c.organizer && <p>主催: {c.organizer}</p>}
                      </div>
                    )}

                    {c.description && (
                      <p className="concertDescription">
                        {c.description.length > 100
                          ? `${c.description.slice(0, 100)}…`
                          : c.description}
                      </p>
                    )}

                    <div className="cardFooter">詳細を見る →</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .page {
          margin-left: 220px;
          min-height: 100vh;
          background: #faf8f4;
          color: #222;
        }

        .hero {
          position: relative;
          min-height: 460px;
          background-image:
            linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)),
            url('/hero.jpg');
          background-size: cover;
          background-position: center center;
          display: flex;
          align-items: center;
          padding: 40px 48px;
        }

        .heroOverlay {
          max-width: 760px;
          color: #fff;
        }

        .heroRoman {
          margin: 0 0 8px;
          font-size: 14px;
          letter-spacing: 0.25em;
          opacity: 0.9;
        }

        .heroName {
          margin: 0;
          font-size: clamp(42px, 8vw, 72px);
          line-height: 1.05;
          font-weight: 700;
        }

        .heroTitle {
          margin: 14px 0 0;
          font-size: clamp(18px, 3vw, 26px);
          font-weight: 500;
        }

        .heroLead {
          margin-top: 18px;
          font-size: 16px;
          line-height: 1.9;
          max-width: 680px;
          color: rgba(255,255,255,0.95);
        }

        .heroButtons {
          margin-top: 28px;
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .heroButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 600;
          transition: 0.2s ease;
        }

        .heroButton.primary {
          background: #ffffff;
          color: #111;
        }

        .heroButton.primary:hover {
          opacity: 0.9;
        }

        .heroButton.secondary {
          border: 1px solid rgba(255,255,255,0.8);
          color: #fff;
          background: rgba(255,255,255,0.08);
        }

        .heroButton.secondary:hover {
          background: rgba(255,255,255,0.16);
        }

        .content {
          padding: 40px;
        }

        .section {
          margin-bottom: 56px;
        }

        .sectionTitle {
          font-size: 28px;
          margin: 0 0 20px;
        }

        .sectionHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .noticeBox {
          background: #fff;
          border: 1px solid #e5e2dc;
          border-radius: 16px;
          padding: 18px 20px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.04);
        }

        .profileCard {
          background: #fff;
          border: 1px solid #e5e2dc;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.05);
        }

        .profileRoman {
          margin: 0 0 6px;
          letter-spacing: 0.18em;
          font-size: 13px;
          color: #666;
        }

        .profileName {
          margin: 0;
          font-size: 32px;
        }

        .profileRole {
          margin: 8px 0 0;
          color: #555;
          font-weight: 600;
        }

        .profileText {
          margin: 18px 0 0;
          line-height: 1.9;
          color: #444;
        }

        .snsList {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .snsButton {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 999px;
          text-decoration: none;
          color: #fff;
          font-weight: 600;
          box-shadow: 0 6px 14px rgba(0,0,0,0.08);
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .snsButton:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .snsButton.x {
          background: #111;
        }

        .snsButton.instagram {
          background: linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4);
        }

        .snsButton.youtube {
          background: #ff0000;
        }

        .snsIcon {
          width: 22px;
          height: 22px;
          display: block;
          flex-shrink: 0;
        }

        .pastLink {
          text-decoration: none;
          color: #7a5c22;
          font-weight: 600;
        }

        .concertGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .concertCard {
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1px solid #e5e2dc;
          border-radius: 22px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 8px 22px rgba(0,0,0,0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          min-height: 100%;
        }

        .concertCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.10);
        }

        .imageWrap {
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #ece8df;
          overflow: hidden;
        }

        .concertImage {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .noImage {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #777;
          font-size: 14px;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, #ece8df, #ddd7cb);
        }

        .concertBody {
          display: flex;
          flex-direction: column;
          padding: 18px;
          gap: 10px;
          flex: 1;
        }

        .concertDate {
          margin: 0;
          font-size: 14px;
          color: #8b6f35;
          font-weight: 700;
        }

        .concertTitle {
          margin: 0;
          font-size: 22px;
          line-height: 1.4;
        }

        .concertVenue {
          margin: 0;
          color: #444;
          font-weight: 500;
        }

        .concertMeta {
          margin-top: 2px;
          color: #555;
          font-size: 14px;
          line-height: 1.7;
        }

        .concertMeta p {
          margin: 0;
        }

        .concertDescription {
          margin: 0;
          color: #555;
          line-height: 1.8;
          font-size: 14px;
        }

        .cardFooter {
          margin-top: auto;
          padding-top: 6px;
          color: #7a5c22;
          font-weight: 700;
        }

        @media (max-width: 1100px) {
          .concertGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .page {
            margin-left: 0 !important;
          }

          .hero {
            min-height: 420px;
            padding: 28px 20px;
          }

          .content {
            padding: 24px 16px 40px;
          }

          .sectionTitle {
            font-size: 24px;
          }

          .concertGrid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .heroLead {
            font-size: 15px;
          }

          .profileCard {
            padding: 20px;
          }
        }
      `}</style>
    </main>
  );
}
