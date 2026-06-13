import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://あなたの演奏サイトURL"),

  title: {
    default: "和田広野｜バリトン歌手",
    template: "%s｜和田広野",
  },

  description:
    "バリトン歌手・和田広野の公式サイト。公演情報、プロフィール、レパートリー、ブログなどを掲載しています。",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "和田広野｜バリトン歌手",
    description:
      "公演情報・プロフィール・レパートリーを掲載する公式サイト。",
    url: "https://あなたの演奏サイトURL",
    siteName: "和田広野",
    locale: "ja_JP",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "和田広野｜バリトン歌手",
    description:
      "バリトン歌手・和田広野の公式サイト。公演情報・プロフィール掲載。",
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