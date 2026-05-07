'use client';

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      setStatus("送信しました ✅");
      e.currentTarget.reset();
    } else {
      setStatus("送信に失敗しました ❌");
    }
  };

  return (
    <main style={{ padding: "40px" }}>
      <h1>お問い合わせ</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>

        <label>お名前</label>
        <input
          type="text"
          name="name"
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>メールアドレス</label>
        <input
          type="email"
          name="email"
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>内容</label>
        <textarea
          name="message"
          required
          style={{ width: "100%", height: "120px", marginBottom: "10px" }}
        />

        <button type="submit">送信</button>

      </form>

      <p>{status}</p>
    </main>
  );
}