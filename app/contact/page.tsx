import Link from "next/link";

export default function ContactPage() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        お問い合わせ
      </h1>

      <p style={{ marginBottom: "30px", lineHeight: "1.8" }}>
        演奏のご依頼・その他のお問い合わせは
        <br />
        下記フォームよりお願いいたします。
        <br />
        レッスンをご希望の方は、専用ページをご覧ください。
      </p>

      {/* ✅ ボタンエリア */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* ✅ Google Forms */}
        <a
          href="https://forms.office.com/r/UWPHafVb4h"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "14px 24px",
            background: "#1b2a41",
            color: "#fff",
            borderRadius: "12px",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          演奏依頼・お問い合わせフォーム
        </a>

        {/* ✅ レッスンサイト */}
        <a
          href="https://lesson.wadahirono-baritone.net"
          style={{
            padding: "14px 24px",
            background: "#6c8fb3",
            color: "#fff",
            borderRadius: "12px",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          レッスン専用ページはこちら
        </a>
      </div>
    </main>
  );
}