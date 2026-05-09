"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type PhotoItem = {
  thumbSrc: string;
  fullSrc: string;
  alt: string;
  caption?: string;
};

export default function GalleryPhotoLightbox({ photos }: { photos: PhotoItem[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const count = photos?.length ?? 0;

  const current = useMemo(() => {
    if (!count) return null;
    const safeIndex = ((index % count) + count) % count;
    return { item: photos[safeIndex], safeIndex };
  }, [photos, index, count]);

  const close = () => setOpen(false);

  const prev = () => {
    if (!count) return;
    setIndex((v) => v - 1);
  };

  const next = () => {
    if (!count) return;
    setIndex((v) => v + 1);
  };

  // ✅ キーボード操作（←→ / ESC）
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, count]);

  // ✅ スワイプ（スマホ）
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = () => {
    const start = touchStartX.current;
    const end = touchEndX.current;
    if (start == null || end == null) return;

    const diff = start - end; // 右→左: +, 左→右: -
    const threshold = 40; // スワイプ判定

    if (diff > threshold) next();
    if (diff < -threshold) prev();
  };

  if (!Array.isArray(photos) || photos.length === 0) {
    return <p style={{ color: "#666" }}>写真がありません。</p>;
  }

  return (
    <>
      {/* ✅ サムネグリッド */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        {photos.map((p, i) => (
          <figure key={i} style={{ margin: 0 }}>
            <img
              src={p.thumbSrc}
              alt={p.alt}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
                cursor: "pointer",
                border: "1px solid #eee",
              }}
            />
            {p.caption ? (
              <figcaption style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
                {p.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {/* ✅ Lightbox */}
      {open && current?.item && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            // 背景クリックで閉じる（画像クリックでは閉じない）
            if (e.target === overlayRef.current) close();
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.82)",
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              width: "min(980px, 96vw)",
              display: "grid",
              gap: "10px",
            }}
          >
            {/* 上部バー */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#fff",
                gap: "12px",
              }}
            >
              <div style={{ fontSize: "14px", opacity: 0.9 }}>
                {current.safeIndex + 1} / {count}
              </div>

              <button
                type="button"
                onClick={close}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                ✕ 閉じる
              </button>
            </div>

            {/* 画像本体 */}
            <div
              style={{
                position: "relative",
                background: "#000",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <img
                src={current.item.fullSrc}
                alt={current.item.alt}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  display: "block",
                  background: "#000",
                }}
              />

              {/* 前へ */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="前の画像"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "999px",
                  width: "42px",
                  height: "42px",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                ‹
              </button>

              {/* 次へ */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="次の画像"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "999px",
                  width: "42px",
                  height: "42px",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                ›
              </button>
            </div>

            {/* キャプション */}
            {current.item.caption ? (
              <div style={{ color: "#fff", fontSize: "13px", opacity: 0.9 }}>
                {current.item.caption}
              </div>
            ) : null}

            {/* 操作ヒント */}
            <div style={{ color: "#fff", fontSize: "12px", opacity: 0.75 }}>
              操作：← → / スワイプ / ESCで閉じる
            </div>
          </div>
        </div>
      )}
    </>
  );
}