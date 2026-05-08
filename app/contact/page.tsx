export default function ContactPage() {
  return (
    <main style={{ maxWidth: "700px", margin: "0 auto", padding: "40px" }}>
      
      <h1 style={{ fontSize: "26px", marginBottom: "20px" }}>
        お問い合わせ
      </h1>

      <p style={{ lineHeight: "1.8", marginBottom: "30px" }}>
        演奏依頼・レッスン申込は、下記の書式をご利用ください。<br />
        Excelファイルにご記入の上、メールに添付してお送りください。
      </p>

      {/* ✅ ボタンエリア */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "30px" }}>

        {/* 演奏依頼 */}
        <a
          href="/演奏依頼書.xlsx"
          download
          style={{
            display: "block",
            padding: "14px",
            background: "#111",
            color: "#fff",
            textAlign: "center",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "16px",
          }}
        >
          🎼 演奏依頼書をダウンロード
        </a>

        {/* レッスン申込 */}
        <a
          href="/レッスン申込書.xlsx"
          download
          style={{
            display: "block",
            padding: "14px",
            background: "#444",
            color: "#fff",
            textAlign: "center",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "16px",
          }}
        >
          🎤 レッスン申込書をダウンロード
        </a>
      </div>

      {/* ✅ メール案内 */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          background: "#fafafa",
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>
          その他のお問い合わせ
        </h2>

        <p style={{ margin: 0, lineHeight: "1.8" }}>
          上記以外のお問い合わせは、以下のメールアドレスまでご連絡ください。
        </p>

        <p style={{ marginTop: "10px", fontWeight: "bold" }}>
          📩 example@gmail.com
        </p>
      </div>

    </main>
  );
}