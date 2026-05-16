{/* ✅ ボタンエリア（縦並び） */}
<div
  style={{
    display: "flex",
    flexDirection: "column", // ✅ ここ追加
    alignItems: "center",
    gap: "16px",
  }}
>
  {/* ✅ Google Forms */}
  <a
    href="https://forms.office.com/r/UWPHafVb4h"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      padding: "14px 26px",
      background: "#1b2a41",
      color: "white",
      borderRadius: "30px",
      textDecoration: "none",
      fontSize: "15px",
      width: "280px",
      textAlign: "center",
    }}
  >
    演奏依頼・お問い合わせフォーム
  </a>

  {/* ✅ レッスンサイト */}
  <a
    href="https://lesson.wadahirono-baritone.net"
    style={{
      padding: "14px 26px",
      border: "1px solid #1b2a41",
      color: "#1b2a41",
      borderRadius: "30px",
      textDecoration: "none",
      fontSize: "15px",
      width: "280px",
      textAlign: "center",
    }}
  >
    レッスン専用ページはこちら
  </a>
</div>