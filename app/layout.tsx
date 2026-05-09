import Sidebar from "@/components/Sidebar";

// ✅ SEO + Google登録
export const metadata = {
  title: "和田広野 | バリトン歌手 公式サイト",
  description:
    "バリトン歌手 和田広野の公式サイト。公演情報・プロフィール・レパートリー・写真・動画・お問い合わせはこちら。",

  verification: {
    google: "X6hXtfD-CHOduYANMlCTr4tMOdQm-vVsbN9cr40-4g0",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0 }}>
        <div
          style={{
            display: "flex",
          }}
        >
          {/* ✅ サイドバー */}
          <Sidebar />

          {/* ✅ メインコンテンツ（重要修正） */}
          <main
            style={{
              flex: 1,

              // ⭐ これが超重要！！
              paddingTop: "52px", // スマホの☰分だけ下げる

              paddingLeft: "20px",
              paddingRight: "20px",
              boxSizing: "border-box",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}