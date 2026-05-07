'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 画面幅でスマホ判定
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // /concert/xxx でも「公演情報」をアクティブ扱い
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/" || pathname.startsWith("/concert");
    return pathname === path || pathname.startsWith(path + "/");
  };

  const menuItemStyle = (path: string): React.CSSProperties => ({
    marginBottom: "14px",
    paddingLeft: "10px",
    borderLeft: isActive(path) ? "4px solid #fff" : "4px solid transparent",
  });

  const linkStyle: React.CSSProperties = {
    color: "#fff",
    textDecoration: "none",
    display: "block",
  };

  const closeOnMobile = () => {
    if (isMobile) setOpen(false);
  };

  // PCは常時メニュー表示、スマホは open の時だけ表示
  const showMenu = isMobile ? open : true;

  return (
    <>
      {/* ✅ スマホ：☰のみ（文字「メニュー」は出さない） */}
      {isMobile && (
        <button
          type="button"
          aria-label="メニューを開く"
          onClick={() => setOpen((v) => !v)}
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

      {/* ✅ メニュー本体 */}
      {showMenu && (
        <nav
          style={{
            width: "220px",
            background: "#111",
            color: "#fff",
            padding: "20px",
            height: isMobile ? "calc(100vh - 52px)" : "100vh",
            overflowY: "auto",

            // PCはsticky（左固定っぽい）
            position: isMobile ? "fixed" : "sticky",
            top: isMobile ? 52 : 0,
            left: 0,
            zIndex: 999,
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={menuItemStyle("/")}>
              <Link href="/" style={linkStyle} onClick={closeOnMobile}>
                公演情報
              </Link>
            </li>

            <li style={menuItemStyle("/past-concerts")}>
              <Link href="/past-concerts" style={linkStyle} onClick={closeOnMobile}>
                過去公演
              </Link>
            </li>

            <li style={menuItemStyle("/profile")}>
              <Link href="/profile" style={linkStyle} onClick={closeOnMobile}>
                プロフィール
              </Link>
            </li>

            <li style={menuItemStyle("/repertoire")}>
              <Link href="/repertoire" style={linkStyle} onClick={closeOnMobile}>
                レパートリー
              </Link>
            </li>

            <li style={menuItemStyle("/gallery")}>
              <Link href="/gallery" style={linkStyle} onClick={closeOnMobile}>
                写真・動画
              </Link>
            </li>

            {/* ✅ ここが「お問い合わせ」 */}
            <li style={menuItemStyle("/contact")}>
              <Link href="/contact" style={linkStyle} onClick={closeOnMobile}>
                お問い合わせ
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {/* ✅ スマホでメニュー開いてる時、背景タップで閉じる */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 52,
            left: 220,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 998,
          }}
        />
      )}
    </>
  );
}