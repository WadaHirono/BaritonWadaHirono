"use client";

import { useEffect, useMemo, useState } from "react";

// imgは Sanity image object を想定（mainImage, galleryの要素）
// urlFor はあなたのプロジェクトの既存関数に合わせて import してください
import { urlFor } from "@/lib/urlFor"; // ←パスは環境に合わせて変更

type SanityImage = any;

export default function ConcertImageGallery(props: {
  mainImage?: SanityImage;
  gallery?: SanityImage[];
}) {
  const images = useMemo(() => {
    const list: SanityImage[] = [];
    if (props.mainImage) list.push(props.mainImage);
    if (props.gallery?.length) list.push(...props.gallery);
    // null/undefined除去
    return list.filter(Boolean);
  }, [props.mainImage, props.gallery]);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openAt = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const close = () => setOpen(false);

  // ESCで閉じる
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, images.length]);

  if (!images.length) return null;

  const active = images[activeIndex];
  const activeUrl = urlFor(active).width(1600).auto("format").url();

  return (
    <section style={{ marginTop: "18px" }}>
      {/* ✅ メイン表示（最初の画像を大きく） */}
      <button
        type="button"
        onClick={() => openAt(0)}
        style={{
          border: "none",
          padding: 0,
          background: "transparent",
          cursor: "zoom-in",
          width: "100%",
        }}
        aria-label="画像を拡大表示"
      >
        <img
          src={urlFor(images[0]).width(1200).auto("format").url()}
          alt=""
          style={{
            width: "100%",
            maxHeight: "520px",
            objectFit: "contain",
            borderRadius: "12px",
            background: "#f6f6f6",
          }}
        />
      </button>

      {/* ✅ サムネイル（中央寄せ） */}
      {images.length > 1 && (
        <div
          style={{
            marginTop: "14px",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {images.map((img, idx) => {
            const thumbUrl = urlFor(img).width(220).height(160).fit("crop").auto("format").url();
            const isActive = idx === activeIndex;

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
                aria-label={`サムネイル${idx + 1}を拡大`}
              >
                <img
                  src={thumbUrl}
                  alt=""
                  style={{
                    display: "block",
                    width: "140px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* ✅ ライトボックス（拡大） */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: "24px",
          }}
        >
          {/* 中身クリックで閉じない */}
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
              src={activeUrl}
              alt=""
              style={{
                width: "100%",
                height: "min(80vh, 780px)",
                objectFit: "contain",
                background: "#111",
                display: "block",
              }}
            />

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
                  onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
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
                  onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
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