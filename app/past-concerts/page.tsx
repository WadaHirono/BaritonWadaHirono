import { client } from "@/lib/sanity";

export const revalidate = 60;

type Concert = {
  _id: string;
  title: string;
  date: string;
  venue?: string;
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
      venue
    }
  `);

  const groupedConcerts = concerts.reduce((acc: Record<string, Concert[]>, concert) => {
    const monthKey = getMonthKey(concert.date);

    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }

    acc[monthKey].push(concert);
    return acc;
  }, {});

  const monthKeys = Object.keys(groupedConcerts);

  return (
    <main className="page">
      <h1 className="pageTitle">過去公演</h1>

      {concerts.length === 0 && <p>過去公演はありません。</p>}

      {monthKeys.map((month) => (
        <section key={month} className="monthSection">
          <h2 className="monthTitle">{month}</h2>

          <div className="concertList">
            {groupedConcerts[month].map((c) => (
              <div key={c._id} className="concertCard">
                <h3 className="concertTitle">{c.title}</h3>
                <p className="concertDate">{formatDate(c.date)}</p>
                {c.venue && <p className="concertVenue">{c.venue}</p>}
              </div>
            ))}
          </div>
        </section>
      ))}

      <style>{`
        .page {
          margin-left: 220px;
          padding: 40px;
          background: #faf8f4;
          min-height: 100vh;
          color: #222;
        }

        .pageTitle {
          font-size: 36px;
          margin: 0 0 32px;
        }

        .monthSection {
          margin-bottom: 40px;
        }

        .monthTitle {
          font-size: 24px;
          margin: 0 0 18px;
          padding-bottom: 8px;
          border-bottom: 2px solid #d8c9a8;
          color: #7a5c22;
        }

        .concertList {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .concertCard {
          background: #fff;
          border: 1px solid #e5e2dc;
          border-radius: 18px;
          padding: 18px 20px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
        }

        .concertTitle {
          margin: 0 0 10px;
          font-size: 20px;
          line-height: 1.5;
        }

        .concertDate {
          margin: 0 0 6px;
          color: #8b6f35;
          font-weight: 700;
        }

        .concertVenue {
          margin: 0;
          color: #444;
        }

        @media (max-width: 768px) {
          .page {
            margin-left: 0 !important;
            padding: 24px 16px 40px;
          }

          .pageTitle {
            font-size: 30px;
            margin-bottom: 24px;
          }

          .monthTitle {
            font-size: 22px;
          }

          .concertList {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}