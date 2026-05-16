import Link from "next/link";

export default function ContactPage() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        お問い合わせ
      </h1>

      {/* ✅ 説明文 */}
      <p style={{ marginBottom: "20px", lineHeight: "1.8" }}>
        演奏のご依頼・その他のお問い合わせは
        <br />
        下記フォームよりお願いいたします。
        <br />
        レッスンをご希望の方は、専用ページをご覧ください。
      </p>

      {/* ✅ 返信目安（追加） */}
      <p style={{ marginBottom: "30px", color: "#555", fontSize: "14px" }}>
        ※通常、2〜3日以内にご返信いたします。
      </p>

      {/* ✅ ボタンエリア（縦並び） */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {/* ✅ Google Forms */}
        <a
          href="https://forms.gle/ここにあなたのURL"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            borderRadius: "10px",
            background: "#1b2a41",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
            minWidth: "260px",
          }}
        >
          演奏依頼・お問い合わせフォーム
        </a>

        {/* ✅ レッスンサイト */}
        <a
          href="https://lesson.wadahirono-baritone.net"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            borderRadius: "10px",
            background: "#ffffff",
            color: "#1b2a41",
            border: "1px solid #1b2a41",
            textDecoration: "none",
            fontWeight: "bold",
            minWidth: "260px",
          }}
        >
          レッスン専用ページはこちら
        </a>
      </div>
    </main>
  );
}