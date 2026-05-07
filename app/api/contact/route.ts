import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  console.log("お問い合わせ内容:", body);

  // ✅ 一旦はログ出力だけ（テスト）
  return NextResponse.json({ message: "OK" });
}