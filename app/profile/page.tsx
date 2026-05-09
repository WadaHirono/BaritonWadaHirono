import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

export default async function ProfilePage() {
  const profile = await client.fetch(
    `*[_type == "profile"][0]{
      name,
      roman,   // ✅ 追加
      image,
      bio
    }`
  );

  if (!profile) {
    return <main>データがありません</main>;
  }

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px" }}>

      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        プロフィール
      </h1>

      {/* ✅ 画像 */}
      {profile.image && (
        <img
          src={urlFor(profile.image).width(400).url()}
          alt={profile.name}
          style={{
            width: "100%",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        />
      )}

      {/* ✅ 名前 */}
      <h2 style={{ marginBottom: "5px" }}>
        {profile.name}
      </h2>

      {/* ✅ ローマ字（ここ追加） */}
      {profile.roman && (
        <p style={{ color: "#666", marginBottom: "15px" }}>
          {profile.roman}
        </p>
      )}

      {/* ✅ 本文 */}
      <div style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
        {profile.bio}
      </div>

    </main>
  );
}