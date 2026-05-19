import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanityImage";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      try {
        // ✅ より厳密に（asset._ref が無いなら画像として扱わない）
        if (!value?.asset?._ref) return null;

        const src = urlFor(value).width(1200).quality(80).auto("format").url();
        if (!src) return null;

        return (
          <img
            src={src}
            alt={value?.alt ?? ""}
            loading="lazy"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
              margin: "16px 0",
            }}
          />
        );
      } catch {
        return null;
      }
    },

    youtube: ({ value }) => {
      const url: string | undefined = value?.url;
      if (!url) return null;

      const match =
        url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/) ||
        url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      const id = match?.[1];
      if (!id) return null;

      return (
        <div style={{ margin: "18px 0" }}>
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              allowFullScreen
            />
          </div>
        </div>
      );
    },
  },

  block: {
    normal: ({ children }) => (
      <p style={{ lineHeight: "1.9", margin: "10px 0" }}>{children}</p>
    ),
    h2: ({ children }) => (
      <h2 style={{ marginTop: "26px", marginBottom: "10px" }}>{children}</h2>
    ),
  },
};

export default function PortableContent({ value }: { value: any }) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}