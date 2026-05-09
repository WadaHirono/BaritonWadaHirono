"use client";

import { useState } from "react";
import { urlFor } from "@/lib/image";

type Props = {
  title?: string;
  mainImage?: any;
  gallery?: any[];
};

export default function ConcertLightboxGallery({
  title,
  mainImage,
  gallery,
}: Props) {
  const [active, setActive] = useState<any | null>(null);

  // ✅ 安全に配列を作る（ここ超重要）
  const images = [
    ...(mainImage ? [mainImage] : []),
    ...(Array.isArray(gallery) ? gallery : []),
  ];

  // ✅ 画像が1つもなければ表示しない
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: "30px" }}>

      {/* ✅ サムネ一覧 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        {images.map((img, i) => {
          if (!img) return null; // ✅ 念のため

          const src = urlFor(img).width(800).auto("format").url();

          return (
            <img
              key={img?._key ?? i}
              src={src}
              alt={title ? `${title} ${i + 1}` : `image-${i + 1}`}
              onClick={() => setActive(img)}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            />
          );
        })}
      </div>

      {/* ✅ ライトボックス */}
      {active && (
        <div
          onClick={() => setActive(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={urlFor(active).width(1200).auto("format").url()}
            alt={title || "image"}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
            }}
          />
        </div>
      )}

    </div>
  );
}