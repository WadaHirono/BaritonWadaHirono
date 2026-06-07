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
    *[_type == "concert" && date < string::split(now(), "T")[0]]
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

  const monthKeys = Object.keys(groupedConcerts);

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
                    {c.venue && <p className="concertVenue">{c.venue}</p>}
                    <p className="detailText">詳細を見る →</p>
                  </div>
                </Link>
              ) : (
                <div key={c._id} className="concertCard disabledCard">
                  <div className="cardBody">
                    <p className="concertDate">{formatDate(c.date)}</p>
                    <h3 className="concertTitle">{c.title}</h3>
                    {c.venue && <p className="concertVenue">{c.venue}</p>}
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
          line-height: 1.2;
        }

        .pageLead {
          margin: 0;
          color: #555;
          line-height: 1.8;
        }

        .monthSection {
          margin-bottom: 42px;
        }

        .monthTitle {
          margin: 0 0 18px;
          padding-bottom: 8px;
          font-size: 24px;
          color: #7a5c22;
          border-bottom: 2px solid #d8c9a8;
        }

        .concertGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .concertCard {
          display: block;
          text-decoration: none;
          color: inherit;
          background: #fff;
          border: 1px solid #e5e2dc;
          border-radius: 20px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          overflow: hidden;
        }

        .concertCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 26px rgba(0, 0, 0, 0.09);
        }

        .cardBody {
          padding: 20px;
        }

        .concertDate {
          margin: 0 0 10px;
          color: #8b6f35;
          font-weight: 700;
          font-size: 14px;
        }

        .concertTitle {
          margin: 0 0 10px;
          font-size: 22px;
          line-height: 1.5;
        }

        .concertVenue {
          margin: 0;
          color: #444;
          line-height: 1.7;
        }

        .detailText {
          margin: 16px 0 0;
          color: #7a5c22;
          font-weight: 700;
        }

        .disabledCard {
          cursor: default;
          opacity: 0.9;
        }

        .disabledCard:hover {
          transform: none;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
        }

        .disabledText {
          color: #888;
        }

        @media (max-width: 768px) {
          .page {
            margin-left: 0 !important;
            padding: 24px 16px 40px;
          }

          .pageTitle {
            font-size: 30px;
          }

          .monthTitle {
            font-size: 22px;
          }

          .concertGrid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .concertTitle {
            font-size: 20px;
          }
        }
      `}</style>
    </main>
  );
}