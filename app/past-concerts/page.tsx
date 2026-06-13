import Link from "next/link";
import { client } from "@/lib/sanity";

export const revalidate = 60;

type Concert = {
  _id: string;
  title: string;
  date: string;
  venue?: string;
  slug?: {
    current?: string;
  };
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getMonthKey(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}年${month}月`;
}

export default async function PastConcertsPage() {
  const concerts: Concert[] = await client.fetch(`
    *[_type == "concert" && date < now()]
    | order(date desc){
      _id,
      title,
      date,
      venue,
      slug
    }
  `);

  const groupedConcerts = concerts.reduce(
    (acc: Record<string, Concert[]>, concert) => {
      const monthKey = getMonthKey(concert.date);

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }

      acc[monthKey].push(concert);
      return acc;
    },
    {}
  );

  // ✅ 並び順安定（新しい月が上）
  const monthKeys = Object.keys(groupedConcerts).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <main className="page">
      <div className="header">
        <h1 className="pageTitle">過去公演</h1>
        <p className="pageLead">
          これまでの出演公演を月ごとにまとめて掲載しています。
        </p>
      </div>

      {concerts.length === 0 && <p>過去公演はありません。</p>}

      {monthKeys.map((month) => (
        <section key={month} className="monthSection">
          <h2 className="monthTitle">{month}</h2>

          <div className="concertGrid">
            {groupedConcerts[month].map((c) =>
              c.slug?.current ? (
                <Link
                  key={c._id}
                  href={`/concert/${c.slug.current}`}
                  className="concertCard"
                >
                  <div className="cardBody">
                    <p className="concertDate">{formatDate(c.date)}</p>
                    <h3 className="concertTitle">{c.title}</h3>
                    {c.venue && (
                      <p className="concertVenue">{c.venue}</p>
                    )}
                    <p className="detailText">詳細を見る →</p>
                  </div>
                </Link>
              ) : (
                <div key={c._id} className="concertCard disabledCard">
                  <div className="cardBody">
                    <p className="concertDate">{formatDate(c.date)}</p>
                    <h3 className="concertTitle">{c.title}</h3>
                    {c.venue && (
                      <p className="concertVenue">{c.venue}</p>
                    )}
                    <p className="detailText disabledText">
                      詳細ページはありません
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      ))}

      <style>{`
        .page {
          margin-left: 220px;
          padding: 40px;
          min-height: 100vh;
          background: #faf8f4;
          color: #222;
        }

        .header {
          margin-bottom: 36px;
        }

        .pageTitle {
          margin: 0 0 10px;
          font-size: 36px;
        }

        .pageLead {
          color: #555;
        }

        .monthSection {
          margin-bottom: 42px;
        }

        .monthTitle {
          margin: 0 0 18px;
          font-size: 24px;
          color: #7a5c22;
          border-bottom: 2px solid #d8c9a8;
        }

        .concertGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .concertCard {
          display: block;
          background: #fff;
          border-radius: 20px;
          padding: 20px;
          text-decoration: none;
          color: inherit;
          transition: 0.2s;
        }

        .concertCard:hover {
          transform: translateY(-4px);
        }

        .concertDate {
          color: #8b6f35;
          font-weight: 700;
        }

        .concertTitle {
          font-size: 20px;
        }

        .concertVenue {
          color: #444;
        }

        .detailText {
          color: #7a5c22;
        }

        .disabledText {
          color: #888;
        }
      `}</style>
    </main>
  );
}