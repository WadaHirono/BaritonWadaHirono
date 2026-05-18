"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ 初回マウント後にだけ判定（スマホで一瞬メニューが出る問題を防ぐ）
  useEffect(() => {
    setMounted(true);

    const update = () => setIsMobile(window.innerWidth <= 768);
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // /concert/xxx でも「TOP・公演情報」をアクティブ扱い
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/" || pathname.startsWith("/concert");
    return pathname === path || pathname.startsWith(path + "/");
  };

  const menu = useMemo(
    () => [
      { href: "/", label: "TOP・公演情報" },
      { href: "/past-concerts", label: "過去公演" },
      { href: "/profile", label: "プロフィール" },
      { href: "/repertoire", label: "レパートリー" },
      { href: "/gallery", label: "写真・動画" },
      { href: "/contact", label: "お問い合わせ" },
    ],
    []
  );

  const linkStyle: React.CSSProperties = {
    color: "#fff",
    textDecoration: "none",
    display: "block",
  };

  const menuItemStyle = (path: string): React.CSSProperties => ({
    marginBottom: "14px",
    paddingLeft: "10px",
    borderLeft: isActive(path) ? "4px solid #fff" : "4px solid transparent",
  });

  const closeOnMobile = () => {
    if (isMobile) setOpen(false);
  };

  // ✅ PCは常時表示 / スマホは open のときだけ表示
  const showMenu = mounted ? (isMobile ? open : true) : false;

  return (
    <>
      {/* ✅ スマホ：左上に≡（固定） */}
      {mounted && isMobile && (
        <button
          type="button"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={open}
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
          ≡
        </button>
      )}

      {/* ✅ メニュー本体 */}
      {showMenu && (
        <nav
          aria-label="サイトメニュー"
          style={{
            width: "220px",
            background: "#111",
            color: "#fff",
            padding: "20px",
            height: mounted && isMobile ? "calc(100vh - 52px)" : "100vh",
            overflowY: "auto",

            // PCはsticky / スマホはfixed
            position: mounted && isMobile ? "fixed" : "sticky",
            top: mounted && isMobile ? 52 : 0,
            left: 0,
            zIndex: 999,
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {menu.map((item) => (
              <li key={item.href} style={menuItemStyle(item.href)}>
                <Link href={item.href} style={linkStyle} onClick={closeOnMobile}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* ✅ スマホでメニュー開いてる時、背景タップで閉じる */}
      {mounted && isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
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