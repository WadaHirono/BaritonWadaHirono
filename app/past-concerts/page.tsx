import { client } from "@/lib/sanity";

export default async function Page() {
  const concerts = await client.fetch(
    `*[_type == "concert" && dateTime(date) < now()]
     | order(date desc)`
  );

  return (
    <main className="main">
      <div className="container">

        <h1>過去公演</h1>

        {concerts.length === 0 && <p>過去公演はありません。</p>}

        {concerts.map((c: any) => (
          <div key={c._id} className="item">
            <h3>{c.title}</h3>
            <p>{new Date(c.date).toLocaleDateString("ja-JP")}</p>
            <p>{c.venue}</p>
          </div>
        ))}

      </div>

      <style jsx>{`
        .main {
          margin-left: 220px;
        }

        .container {
          padding: 40px;
        }

        .item {
          margin-bottom: 20px;
        }

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
``