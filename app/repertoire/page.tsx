import { client } from "@/lib/sanity";

type RepertoireItem = {
  _id: string;
  title?: string;
  composer?: string;
  genre?: string;
};

function normalize(s?: string) {
  return (s ?? "").trim();
}

export default async function RepertoirePage() {
  // まずはSanityから全部取得（並びは最終的にJS側で確定するので order は最低限でOK）
  const items: RepertoireItem[] = await client.fetch(
    `*[_type == "repertoire"]{
      _id,
      title,
      composer,
      genre
    }`
  );

  // ✅ グループ化（genre未入力は「その他」）
  const groups = new Map<string, RepertoireItem[]>();

  for (const item of items) {
    const g = normalize(item.genre) || "その他";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(item);
  }

  // ✅ ジャンル名の並び（日本語の辞書順っぽく）
  const sortedGenres = Array.from(groups.keys()).sort((a, b) =>
    a.localeCompare(b, "ja")
  );

  // ✅ 各ジャンル内を「作曲者 → 曲名」でソート
  for (const g of sortedGenres) {
    groups.get(g)!.sort((x, y) => {
      const cx = normalize(x.composer);
      const cy = normalize(y.composer);
      const tx = normalize(x.title);
      const ty = normalize(y.title);

      const cCmp = cx.localeCompare(cy, "ja");
      if (cCmp !== 0) return cCmp;

      return tx.localeCompare(ty, "ja");
    });
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>レパートリー</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        ジャンルごとにまとめ、各ジャンル内は「作曲者順 → 曲名順」で表示しています。
      </p>

      {sortedGenres.map((genre) => {
        const list = groups.get(genre)!;

        return (
          <section key={genre} style={{ marginBottom: "36px" }}>
            <h2
              style={{
                fontSize: "20px",
                marginBottom: "14px",
                paddingBottom: "8px",
                borderBottom: "2px solid #eee",
              }}
            >
              {genre}
            </h2>

            <div style={{ display: "grid", gap: "12px" }}>
              {list.map((item) => (
                <div
                  key={item._id}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    background: "#fff",
                  }}
                >
                  <div style={{ fontSize: "16px", fontWeight: 700 }}>
                    {item.title || "（曲名未入力）"}
                  </div>
                  <div style={{ color: "#666", marginTop: "4px" }}>
                    {item.composer || "（作曲者未入力）"}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}