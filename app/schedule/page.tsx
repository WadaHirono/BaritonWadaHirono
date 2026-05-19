import { client } from "@/lib/sanity";

export const dynamic = "force-dynamic";

type Concert = {
  _id: string;
  title?: string;
  date?: string;
  organizer?: string;
  venue?: string;
  role?: string;
};

export default async function SchedulePage() {
  const concerts: Concert[] = await client.fetch(
    `*[_type == "concert"] | order(date asc){
      _id,
      "title": title,
      "date": coalesce(date, publishedAt),
      "organizer": organizer,
      "venue": venue,
      "role": role
    }`
  );

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>スケジュール</h1>

      {concerts.length === 0 ? (
        <p>現在予定はありません。</p>
      ) : (
        <div>
          {concerts.map((c) => (
            <div
              key={c._id}
              style={{
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                background: "rgba(255,255,255,0.7)",
              }}
            >
              <div style={{ fontWeight: "700", fontSize: "18px" }}>
                {c.title}
              </div>

              <div style={{ color: "#555", marginTop: "6px" }}>
                {c.date &&
                  new Date(c.date).toLocaleDateString("ja-JP")}
              </div>

              {c.organizer && <div>主催：{c.organizer}</div>}
              {c.venue && <div>会場：{c.venue}</div>}
              {c.role && <div>出演：{c.role}</div>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}