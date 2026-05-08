export default function ContactPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      <a href="/演奏依頼書.xlsx" download>
        🎼 演奏依頼書をダウンロード
      </a>

      <a href="/レッスン申込書.xlsx" download>
        🎤 レッスン申込書をダウンロード
      </a>

    </div>
  );
}