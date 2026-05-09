import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "和田広野 | バリトン歌手",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0 }}>
        <div style={{ display: "flex" }}>
          <Sidebar />

          <main style={{ flex: 1, paddingTop: "52px", padding: "20px" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}