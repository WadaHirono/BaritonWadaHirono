import { client } from "@/lib/sanity";

export default async function Page() {
  const concerts = await client.fetch(
    `*[_type == "concert" && dateTime(date) < now()]
     | order(date desc)`
  );

  return (
    <main style={{ marginLeft: "220px", padding: 40 }}>
      <h1>過去公演</h1>

      {concerts.map((c: any) => (
        <div key={c._id}>
          <h4>{c.title}</h4>
          <p>
            {new Date(c.date + "T00:00:00").toLocaleDateString("ja-JP")}
          </p>
          <p>{c.venue}</p>
        </div>
      ))}
    </main>
  );
}
