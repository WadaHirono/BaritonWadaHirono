import { client } from "@/lib/sanity";

export const revalidate = 60;

export const metadata = {
  title: "レパートリー｜和田広野",
  description:
    "和田広野のレパートリー一覧。ジャンルごとに、作曲者（五十音順）・曲名順で掲載しています。",
};

type RepertoireItem = {
  _id: string;
  title?: string;
  composer?: string;
  composerKana?: string;
  genre?: string;
};

function normalize(value?: string) {
  return (value ?? "").trim();
}

export default async function RepertoirePage() {
  const items: RepertoireItem[] = await client.fetch(`
    *[_type == "repertoire"]{
      _id,
      title,
      composer,
      composerKana,
      genre
    }
  `);

  const groups = new Map<string, RepertoireItem[]>();

  for (const item of items) {
    const genre = normalize(item.genre) || "その他";
    if (!groups.has(genre)) {
      groups.set(genre, []);
    }
    groups.get(genre)!.push(item);
  }

  const sortedGenres = Array.from(groups.keys()).sort((a, b) =>
    a.localeCompare(b, "ja")
  );

  for (const genre of sortedGenres) {
    groups.get(genre)!.sort((x, y) => {
      const composerX = normalize(x.composerKana || x.composer);
      const composerY = normalize(y.composerKana || y.composer);
      const titleX = normalize(x.title);
      const titleY = normalize(y.title);

      const composerCompare = composerX.localeCompare(composerY, "ja");
      if (composerCompare !== 0) return composerCompare;

      return titleX.localeCompare(titleY, "ja");
    });
  }

  return (
    <main className="page">
      <div className="header">
        <h1 className="pageTitle">レパートリー</h1>
        <p className="pageLead">
          ジャンルごとにまとめ、各ジャンル内は
          「作曲者（五十音順）→ 曲名順」で表示しています。
        </p>
      </div>

      {items.length === 0 && (
        <p className="emptyText">レパートリーはまだありません。</p>
      )}

      {sortedGenres.map((genre) => {
        const list = groups.get(genre)!;

        return (
          <section key={genre} className="genreSection">
            <h2 className="genreTitle">{genre}</h2>

            <div className="itemGrid">
              {list.map((item) => (
                <div key={item._id} className="itemCard">
                  <div className="itemTitle">
                    {item.title || "（曲名未入力）"}
                  </div>
                  <div className="itemComposer">
                    {item.composer || "（作曲者未入力）"}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <style>{`
        .page {
          margin-left: 220px;
          min-height: 100vh;
          padding: 40px;
          background: #faf8f4;
          color: #222;
        }

        .header {
          margin-bottom: 36px;
        }

        .pageTitle {
          margin: 0 0 12px;
          font-size: 36px;
          line-height: 1.2;
        }

        .pageLead {
          margin: 0;
          color: #555;
          line-height: 1.9;
        }

        .emptyText {
          margin-top: 20px;
          color: #666;
        }

        .genreSection {
          margin-bottom: 42px;
        }

        .genreTitle {
          margin: 0 0 18px;
          padding-bottom: 8px;
          font-size: 24px;
          color: #7a5c22;
          border-bottom: 2px solid #d8c9a8;
        }

        .itemGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .itemCard {
          background: #fff;
          border: 1px solid #e5e2dc;
          border-radius: 16px;
          padding: 16px 18px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }

        .itemTitle {
          font-size: 17px;
          font-weight: 700;
          line-height: 1.6;
        }

        .itemComposer {
          margin-top: 6px;
          color: #666;
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          .page {
            margin-left: 0 !important;
            padding: 24px 16px 40px;
          }

          .pageTitle {
            font-size: 30px;
          }

          .genreTitle {
            font-size: 22px;
          }

          .itemGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
``