"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const update = () => setIsMobile(window.innerWidth <= 768);
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
      { href: "/blog", label: "ブログ" },
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

  if (!mounted) return null;

  const showMenu = isMobile ? open : true;

  return (
    <>
      {/* ✅ 最上位レイヤーのハンバーガー */}
      {isMobile && (
        <button
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
            zIndex: 10000, // ✅ サイドバーより上
            fontSize: "22px",
            textAlign: "left",
            paddingLeft: "14px",
          }}
        >
          ≡
        </button>
      )}

      {/* ✅ サイドバー本体（最重要） */}
      {showMenu && (
        <nav
          style={{
            width: "220px",
            background: "#111",
            color: "#fff",
            padding: "20px",
            height: "100vh",

            position: "fixed", // ✅ これ重要（stickyではなく固定）
            top: isMobile ? 52 : 0,
            left: 0,

            zIndex: 9999, // ✅ 最前面
          }}
        >
          <ul style={{ listStyle: "none", padding: 0 }}>
            {menu.map((item) => (
              <li key={item.href} style={menuItemStyle(item.href)}>
                <Link
                  href={item.href}
                  style={linkStyle}
                  onClick={closeOnMobile}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* ✅ 背景（暗くする） */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 52,
            left: 220,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 9998,
          }}
        />
      )}
    </>
  );
}