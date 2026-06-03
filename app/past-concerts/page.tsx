import { client } from "@/lib/sanity";

type Concert = {
  _id: string;
  title: string;
  date: string;
  venue: string;
};

export default async function PastConcertsPage() {
  const concerts: Concert[] = await client.fetch(
    `*[_type == "concert" && dateTime(date) < now()] | order(date desc)`
  );

  // ✅ 年ごとにグループ化
  const grouped: Record<string, Concert[]> = {};

  concerts.forEach((concert) => {
    const d = new Date(concert.date + "T00:00:00");
    const year = d.getFullYear().toString();

    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(concert);
  });

  return (
    <main style={{ marginLeft: "220px", padding: "40px" }}>
      <h1>過去公演</h1>

      {concerts.length === 0 && <p>過去公演はまだありません。</p>}

      {Object.entries(grouped).map(([year, list]) => (
        <div key={year} style={{ marginBottom: "40px" }}>
          <h2>{year}</h2>

          {list.map((concert) => (
            <div key={concert._id} style={{ marginBottom: "10px" }}>
              <div>{concert.title}</div>
              <div style={{ color: "#666" }}>
                {new Date(concert.date + "T00:00:00").toLocaleDateString("ja-JP")}
              </div>
              <div>{concert.venue}</div>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}