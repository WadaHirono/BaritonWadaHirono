'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ スマホ判定
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ✅ 現在ページハイライト
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/" || pathname.startsWith("/concert");
    return pathname === path || pathname.startsWith(path + "/");
  };

  const menuStyle = (path: string) => ({
    marginBottom: "15px",
    paddingLeft: "10px",
    borderLeft: isActive(path) ? "4px solid #fff" : "4px solid transparent",
  });

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    display: "block",
  };

  const handleNavigate = () => {
    if (isMobile) setOpen(false);
  };

  return (
    <>
      {/* ✅ スマホ：☰のみ表示 */}
      {isMobile && (
        <button
          onClick={() => setOpen(!open)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "52px",
            background: "#111",
            color: "#fff",
            border: "none",
            padding: "0 16px",
            zIndex: 1000,
            cursor: "pointer",
            fontSize: "22px",
            textAlign: "left",
          }}
        >
          ☰
        </button>
      )}

      {/* ✅ メニュー */}
      <nav
        style={{
          background: "#111",
          color: "#fff",
          padding: "20px",
          width: "220px",
          height: "100vh",
          overflowY: "auto",
          position: isMobile ? "fixed" : "sticky",
          top: isMobile ? 52 : 0,
          left: 0,
          zIndex: 999,
          display: isMobile ? (open ? "block" : "none") : "block",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>

          <li style={menuStyle("/")}>
            <Link href="/" style={linkStyle} onClick={handleNavigate}>
              公演情報
            </Link>
          </li>

          <li style={menuStyle("/past-concerts")}>
            <Link href="/past-concerts" style={linkStyle} onClick={handleNavigate}>
              過去公演
            </Link>
          </li>

          <li style={menuStyle("/profile")}>
            <Link href="/profile" style={linkStyle} onClick={handleNavigate}>
              プロフィール
            </Link>
          </li>

          <li style={menuStyle("/repertoire")}>
            <Link href="/repertoire" style={linkStyle} onClick={handleNavigate}>
              レパートリー
            </Link>
          </li>

          <li style={menuStyle("/gallery")}>
            <Link href="/gallery" style={linkStyle} onClick={handleNavigate}>
              写真・動画
            </Link>
          </li>

          <li style={menuStyle("/contact")}>
            <Link href="/contact" style={linkStyle} onClick={handleNavigate}>
              お問い合わせ
            </Link>
          </li>

        </ul>
      </nav>

      {/* ✅ スマホ：背景タップで閉じる */}
      {isMobile && open && (
