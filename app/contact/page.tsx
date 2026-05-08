export default function ContactPage() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>お問い合わせ</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "30px",
        }}
      >

        {/* 演奏依頼ボタン */}
        <a
          href="/演奏依頼書.xlsx"
          download
          style={{
            display: "block",
            padding: "16px",
            background: "#000",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          🎼 演奏依頼書をダウンロード
        </a>

        {/* レッスン申込ボタン */}
        <a
          href="/レッスン申込表.xlsx"
          download
          style={{
            display: "block",
            padding: "16px",
            background: "#000",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          🎤 レッスン申込書をダウンロード
        </a>

      </div>

      <p style={{ marginTop: "40px" }}>
        その他のお問い合わせはメールでご連絡ください。<br />
        📩 donchan.hiono528@gmail.com
      </p>
    </main>
  );
}