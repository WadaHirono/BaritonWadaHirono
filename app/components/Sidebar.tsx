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
      {/* ✅ 必ず見えるハンバーガー */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",     // ✅ 上に固定（重要）
          top: 0,
          left: 0,
          width: "100%",
          background: "#111",
          color: "#fff",
          padding: "15px",
          zIndex: 1000,          // ✅ 前面に表示
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
          width: "200px",
          height: "100vh",
          background: "#111",
          color: "#fff",
          padding: "20px",
          display: open ? "block" : "none",
          zIndex: 999,
        }}
      >
        <ul style={{ listStyle: "none", padding: 0 }}>

          <li style={menuStyle("/")}>
            <Link href="/" style={linkStyle}>公演情報</Link>
          </li>

          <li style={menuStyle("/profile")}>
            <Link href="/profile" style={linkStyle}>プロフィール</Link>
          </li>

          <li style={menuStyle("/repertoire")}>
            <Link href="/repertoire" style={linkStyle}>レパートリー</Link>
          </li>

          <li style={menuStyle("/gallery")}>
            <Link href="/gallery" style={linkStyle}>写真・動画</Link>
          </li>

          <li style={menuStyle("/contact")}>
            <Link href="/contact" style={linkStyle}>お問い合わせ</Link>
          </li>

        </ul>
      </nav>
    </>
  );
}