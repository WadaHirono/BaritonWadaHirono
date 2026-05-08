export default function ContactPage() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>お問い合わせ</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
        <a href="/演奏依頼書.xlsx" download>
          🎼 演奏依頼書をダウンロード
        </a>

        <a href="/レッスン申込書.xlsx" download>
          🎤 レッスン申込書をダウンロード
        </a>
      </div>

      <p style={{ marginTop: "30px" }}>
        その他のお問い合わせはメールでご連絡ください。<br />
        📩 donchan.hirono528@gmail.com
      </p>
    </main>
  );
}