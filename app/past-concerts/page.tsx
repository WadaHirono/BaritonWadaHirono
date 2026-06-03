import { client } from "@/lib/sanity";

export default async function Page() {
  const concerts = await client.fetch(
    `*[_type == "concert" && dateTime(date) < now()]
     | order(date desc)`
  );

  return (
    <main style={{ marginLeft: "220px", padding: "40px" }}>
      <h1>過去公演</h1>

      {concerts.length === 0 && <p>過去公演はありません。</p>}

      {concerts.map((c: any) => (
        <div key={c._id} style={{ marginBottom: "15px" }}>
          <h3>{c.title}</h3>
          <p>
            {new Date(c.date + "T00:00:00").toLocaleDateString("ja-JP")}
          </p>
          <p>{c.venue}</p>
        </div>
      ))}
    </main>
  );
}
``