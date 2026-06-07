import { client } from "@/lib/sanity";

export const revalidate = 60;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PastConcertsPage() {
  const concerts = await client.fetch(`
    *[_type == "concert" && date < string::split(now(), "T")[0]]
    | order(date desc){
      _id,
      title,
      date,
      venue
    }
  `);

  return (
    <main style={{ marginLeft: "220px", padding: "40px" }}>
      <h1>過去公演</h1>

      {concerts.length === 0 && <p>過去公演はありません。</p>}

      {concerts.map((c: any) => (
        <div key={c._id} style={{ marginBottom: "20px" }}>
          <h3>{c.title}</h3>

          <p>{formatDate(c.date)}</p>

          <p>{c.venue}</p>
        </div>
      ))}

      {/* スマホ対応 */}
      <style>
        {`
        @media (max-width: 768px) {
          main {
            margin-left: 0 !important;
          }
        }
      `}
      </style>
    </main>
  );
}