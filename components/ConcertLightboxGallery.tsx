"use client";

import { useEffect, useMemo, useState } from "react";
import { urlFor } from "@/lib/image";

type SanityImage = any;

export default function ConcertLightboxGallery({
  title,
  mainImage,
  gallery,
}: {
  title: string;
  mainImage?: SanityImage;
  gallery?: SanityImage[];
}) {
  // 先頭にメイン画像、その後にサブ画像を連結
  const images = useMemo(() => {
    const list: SanityImage[] = [];
    if (mainImage) list.push(mainImage);
    if (Array.isArray(gallery) && gallery.length) list.push(...gallery);
    return list.filter(Boolean);
  }, [mainImage, gallery]);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const openAt = (idx: number) => {
    setActive(idx);
    setOpen(true);
  };
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, images.length]);

  if (!images.length) return null;

  const current = images[active];
  const currentUrl = urlFor(current).width(1600).auto("format").url();
  const currentCaption = current?.caption;

  return (
    <section style={{ marginBottom: "30px" }}>
      {/* ✅ メイン画像（クリックで拡大） */}
      {images[0] && (
        <button
          type="button"
          onClick={() => openAt(0)}
          aria-label="画像を拡大表示"
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "zoom-in",
            width: "100%",
          }}
        >
          <img
            src={urlFor(images[0]).width(1100).auto("format").url()}
            alt={title}
            style={{
              width: "100%",
              borderRadius: "12px",
              marginBottom: "14px",
              background: "#f6f6f6",
              objectFit: "contain",
            }}
          />
        </button>
      )}

      {/* ✅ サムネ（中央寄せ） */}
      {images.length > 1 && (
        <>
          <h2 style={{ marginBottom: "12px" }}>関連画像</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",   // ←真ん中寄せの肝
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {images.map((img, idx) => {
              const thumbUrl = urlFor(img).width(240).height(170).fit("crop").auto("format").url();
              const isActive = idx === active;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => openAt(idx)}
                  style={{
                    border: isActive ? "2px solid #111" : "1px solid #ddd",
                    borderRadius: "10px",
                    padding: 0,
                    overflow: "hidden",
                    background: "#fff",
                    cursor: "zoom-in",
                  }}
                  aria-label={`画像${idx + 1}を拡大`}
                >
                  <img
                    src={thumbUrl}
                    alt={`${title} サムネイル ${idx + 1}`}
                    style={{ width: "220px", height: "160px", objectFit: "cover", display: "block" }}
                  />
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ✅ ライトボックス */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(1100px, 100%)",
              borderRadius: "14px",
              overflow: "hidden",
              background: "#111",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              position: "relative",
            }}
          >
            <img
              src={currentUrl}
              alt={`${title} 拡大 ${active + 1}`}
              style={{
                width: "100%",
                height: "min(78vh, 820px)",
                objectFit: "contain",
                background: "#111",
                display: "block",
              }}
            />

            {/* caption（表/裏など） */}
            {currentCaption && (
              <div style={{ padding: "10px 14px", color: "#fff", background: "rgba(0,0,0,0.35)" }}>
                {currentCaption}
              </div>
            )}

            {/* 閉じる */}
            <button
              type="button"
              onClick={close}
              aria-label="閉じる"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 40,
                height: 40,
                borderRadius: 999,
                border: "none",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                cursor: "pointer",
                fontSize: 22,
                lineHeight: "40px",
              }}
            >
              ×
            </button>

            {/* 左右移動（複数画像のみ） */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
                  aria-label="前へ"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 10,
                    transform: "translateY(-50%)",
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    border: "none",
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 20,
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setActive((i) => (i + 1) % images.length)}
                  aria-label="次へ"
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 10,
                    transform: "translateY(-50%)",
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    border: "none",
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 20,
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}