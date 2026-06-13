import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="page">
      <div className="inner">

        <h1 className="pageTitle">お問い合わせ</h1>

        {/* 説明文 */}
        <p className="lead">
          演奏のご依頼・その他のお問い合わせは
          <br />
          下記フォームよりお願いいたします。
          <br />
          レッスンをご希望の方は、専用ページをご覧ください。
        </p>

        <p className="note">
          ※通常、2〜3日以内にご返信いたします。
        </p>

        {/* ボタン */}
        <div className="buttons">

          <a
            href="https://forms.office.com/r/UWPHafVb4h"
            target="_blank"
            rel="noopener noreferrer"
            className="primaryBtn"
          >
            演奏依頼・お問い合わせフォーム
          </a>

          <a
            href="https://lesson.wadahirono-baritone.net"
            target="_blank"
            rel="noopener noreferrer"
            className="secondaryBtn"
          >
            レッスン専用ページはこちら
          </a>

        </div>
      </div>

      <style>{`
        .page {
          margin-left: 220px;
          min-height: 100vh;
          background: #faf8f4;
        }

        .inner {
          max-width: 700px;
          margin: 0 auto;
          padding: 60px 40px 60px 60px;
          text-align: center;
        }

        .pageTitle {
          font-size: 30px;
          margin-bottom: 30px;
        }

        .lead {
          margin-bottom: 20px;
          line-height: 1.9;
          font-size: 16px;
        }

        .note {
          color: #666;
          margin-bottom: 40px;
          font-size: 14px;
        }

        .buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .primaryBtn {
          display: inline-block;
          padding: 14px 26px;
          border-radius: 10px;
          background: #1b2a41;
          color: #fff;
          text-decoration: none;
          font-weight: bold;
          min-width: 300px;
        }

        .secondaryBtn {
          display: inline-block;
          padding: 14px 26px;
          border-radius: 10px;
          background: #fff;
          color: #1b2a41;
          border: 1px solid #1b2a41;
          text-decoration: none;
          font-weight: bold;
          min-width: 300px;
        }

        /* ✅ スマホ対応 */
        @media (max-width: 768px) {
          .page {
            margin-left: 0 !important;
          }

          .inner {
            padding: 40px 20px;
          }

          .primaryBtn,
          .secondaryBtn {
            width: 100%;
            min-width: unset;
          }
        }
      `}</style>
    </main>
  );
}