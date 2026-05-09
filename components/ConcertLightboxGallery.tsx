"use client";

import { useState } from "react";
import { urlFor } from "@/lib/image";

export default function ConcertLightboxGallery({
  title,
  mainImage,
  gallery,
}: any) {
  const [active, setActive] = useState<any | null>(null);

  const images = [
    ...(mainImage ? [mainImage] : []),
    ...(gallery || []),
  ];

  if (images.length === 0) return null;

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
        {images.map((img: any, i: number) => (
          <img
            key={i}
            src={urlFor(img).width(800).url()}
            alt={`${title} ${i}`}
            onClick={() => setActive(img)}
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          />
        ))}
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
            src={urlFor(active).width(1200).url()}
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