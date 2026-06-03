import { client } from "@/lib/sanity";

type Concert = {
  _id: string;
  title: string;
  date: string;
  venue: string;
};

export default async function PastConcertsPage() {
  const concerts: Concert[] = await client.fetch(
    `*[_type == "concert" && date(date) < date(now())] | order(date desc)`
  );

  // ✅ 年ごとにグループ化
  const grouped: Record<string, Concert[]> = {};

  concerts.forEach((concert) => {
    const d = new Date(concert.date + "T00:00:00"); // ✅ ズレ完全防止
    const year = d.getFullYear().toString();

    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(concert);
  });

  return (
    <main
      style={{
        padding: "40px",
        marginLeft: "220px", // ✅ サイドバーと重ならない
      }}
    >
      <h1>過去公演</h1>

      {concerts.length === 0 && <p>過去公演はまだありません。</p>}

      {Object.entries(grouped).map(([year, list]) => (
        <div key={year} style={{ marginBottom: "40px" }}>
          <h2 style={{ borderBottom: "2px solid #ddd" }}>{year}</h2>

          {list.map((concert) => (
            <div key={concert._id} style={{ margin: "10px 0" }}>
              <div>{concert.title}</div>

              <div style={{ color: "#666" }}>
                {
                  new Date(concert.date + "T00:00:00")
                    .toLocaleDateString("ja-JP")
                }
              </div>

              <div>{concert.venue}</div>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}