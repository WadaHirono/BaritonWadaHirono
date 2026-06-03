import Link from "next/link";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const concerts = await client.fetch(
    `*[_type == "concert" && dateTime(date) >= now() - 1000*60*60*24]
     | order(date asc)`
  );

  const grouped: Record<string, any[]> = {};

  concerts.forEach((c: any) => {
    const d = new Date(c.date + "T00:00:00");
    const key = `${d.getFullYear()}年${d.getMonth() + 1}月`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  });

  return (
    <main style={{ marginLeft: "220px" }}>
      
      {/* ヒーロー */}
      <div style={{ height: 300, background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1>和田広野</h1>
          <p>Hirono Wada</p>
          <p>バリトン歌手</p>
        </div>
      </div>

      <div style={{ padding: 40 }}>

        {/* SNS（アイコン版） */}
        <section style={{ marginBottom: 40 }}>
          <h2>SNS</h2>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="https://x.com/WadaHironoBR" target="_blank">
              <img src="/x.png" width={40} />
            </a>
            <a href="https://www.instagram.com/hirono_wada/" target="_blank">
              <img src="/instagram.png" width={40} />
            </a>
            <a href="https://www.youtube.com/@hironowada9166" target="_blank">
              <img src="/youtube.png" width={40} />
            </a>
          </div>
        </section>

        {/* 公演 */}
        <section>
          <h2>公演情報</h2>

          {Object.entries(grouped).map(([month, list]) => (
            <div key={month}>
              <h3>{month}</h3>

              {list.map((c: any) => (
                <div key={c._id}>
                  <Link href={`/concert/${c.slug?.current}`}>
                    <h4>{c.title}</h4>
                  </Link>

                  <p>
                    {new Date(c.date + "T00:00:00").toLocaleDateString("ja-JP")}
                  </p>
                  <p>{c.venue}</p>
                </div>
              ))}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}