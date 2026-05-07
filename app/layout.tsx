"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // ✅ ページ遷移で自動で閉じる
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <html lang="ja">
      <body style={{ margin: 0 }}>
        <div style={{ display: "flex" }}>

          {/* ✅ ハンバーガー（スマホのみ） */}
          <button
            onClick={() => setOpen(!open)}
            className="menu-button"
          >
            ☰
          </button>

          {/* ✅ サイドバー */}
          <nav
            className="sidebar"
            style={{
              transform: open ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <ul style={{ listStyle: "none", padding: 0 }}>

              <li>
                <Link href="/">TOP・公演情報</Link>
              </li>

              <li>
                <Link href="/profile">プロフィール</Link>
              </li>

              <li>
                <Link href="/repertoire">レパートリー</Link>
              </li>

              <li>
                <Link href="/gallery">写真・動画</Link>
              </li>

              <li>
                <Link href="/past-concerts">過去公演</Link>
              </li>

            </ul>
          </nav>

          {/* ✅ メイン */}
          <main className="content">
            {children}
          </main>

        </div>

        {/* ✅ CSS（重要） */}
        <style jsx global>{`
          body {
            margin: 0;
            font-family: sans-serif;
          }

          .sidebar {
            width: 220px;
            height: 100vh;
            background: #111;
            color: #fff;
            padding: 20px;
            position: fixed;
            top: 0;
            left: 0;
            transition: transform 0.3s ease;
          }

          .sidebar ul li {
            margin-bottom: 20px;
          }

          .content {
            margin-left: 220px;
            width: 100%;
            padding: 20px;
          }

          .menu-button {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 1000;
            background: #111;
            color: #fff;
            border: none;
            padding: 10px;
            font-size: 22px;
            cursor: pointer;
            display: none;
            border-radius: 6px;
          }

          /* ✅ リンク */
          a {
            color: #fff;
            text-decoration: none;
            font-size: 16px;
          }

          a:hover {
            opacity: 0.7;
          }

          /* ✅ スマホ */
          @media (max-width: 768px) {
            .sidebar {
              transform: translateX(-100%);
            }

            .content {
              margin-left: 0;
            }

            .menu-button {
              display: block;
            }
          }

          /* ✅ PC */
          @media (min-width: 769px) {
            .sidebar {
              transform: translateX(0) !important;
            }
          }
        `}</style>
      </body>
    </html>
  );
}