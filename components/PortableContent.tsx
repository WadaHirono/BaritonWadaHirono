import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanityImage";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = urlFor(value).width(900).quality(80).url();
      return (
        <img
          src={src}
          alt={value?.alt || ""}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "12px",
            margin: "18px 0",
          }}
        />
      );
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
                borderRadius: "12px",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    },
  },

  block: {
    h2: ({ children }) => (
      <h2 style={{ marginTop: "28px", marginBottom: "10px" }}>{children}</h2>
    ),
    normal: ({ children }) => (
      <p style={{ lineHeight: "1.9", margin: "10px 0" }}>{children}</p>
    ),
  },
};

export default function PortableContent({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}