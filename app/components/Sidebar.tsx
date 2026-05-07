'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menuStyle = (path: string) => ({
    marginBottom: "15px",
    paddingLeft: "10px",
    borderLeft:
      pathname === path ? "4px solid white" : "4px solid transparent",
  });

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    display: "block",
  };

  return (
    <>
      {/* ✅ スマホでも必ず見えるハンバーガー */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          background: "#111",
          color: "#fff",
          padding: "15px",
          zIndex: 1000,
          cursor: "pointer",
        }}
      >
        ☰ メニュー
      </div>

      {/* ✅ メニュー本体 */}
      <nav
        style={{
          position: "fixed",
          top: "50px",
          left: 0,
          width: "220px",
          height: "100vh",
          background: "#111",
          color: "#fff",
          padding: "20px",
          display: open ? "block" : "none",
          zIndex: 999,
          overflowY: "auto",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={menuStyle("/")}>
            <Link href="/" style={linkStyle} onClick={() => setOpen(false)}>
              公演情報
            </Link>
          </li>

          {/* ✅ 追加：過去公演 */}
          <li style={menuStyle("/past-concerts")}>
            <Link
              href="/past-concerts"
              style={linkStyle}
              onClick={() => setOpen(false)}
            >
              過去公演
            </Link>
          </li>

          <li style={menuStyle("/profile")}>
            <Link
              href="/profile"
              style={linkStyle}
              onClick={() => setOpen(false)}
            >
              プロフィール
            </Link>
          </li>

          <li style={menuStyle("/repertoire")}>
            <Link
              href="/repertoire"
              style={linkStyle}
              onClick={() => setOpen(false)}
            >
              レパートリー
            </Link>
          </li>

          <li style={menuStyle("/gallery")}>
            <Link
              href="/gallery"
              style={linkStyle}
              onClick={() => setOpen(false)}
            >
              写真・動画
            </Link>
          </li>

          <li style={menuStyle("/contact")}>
            <Link
              href="/contact"
              style={linkStyle}
              onClick={() => setOpen(false)}
            >
              お問い合わせ
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
``