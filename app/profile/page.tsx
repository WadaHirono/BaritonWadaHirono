import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image";

export const revalidate = 60;

export default async function ProfilePage() {
  const profile = await client.fetch(`
    *[_type == "profile"][0]{
      name,
      roman,
      voiceType,
      location,
      shortBio,
      image,
      bio
    }
  `);

  if (!profile) {
    return <main>データがありません</main>;
  }

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px" }}>
      
      {/* タイトル */}
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        プロフィール
      </h1>

      {/* ✅ 画像 */}
      {profile.image && (
        <img
          src={urlFor(profile.image).width(600).url()}
          alt={profile.name}
          style={{
            width: "100%",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        />
      )}

      {/* ✅ 名前 */}
      <h2 style={{ marginBottom: "4px" }}>
        {profile.name}
      </h2>

      {/* ✅ ローマ字 */}
      {profile.roman && (
        <p style={{ color: "#666", marginBottom: "10px" }}>
          {profile.roman}
        </p>
      )}

      {/* ✅ 声種 */}
      {profile.voiceType && (
        <p style={{ marginBottom: "6px" }}>
          <strong>声種：</strong>{profile.voiceType}
        </p>
      )}

      {/* ✅ 活動拠点 */}
      {profile.location && (
        <p style={{ marginBottom: "20px" }}>
          <strong>活動拠点：</strong>{profile.location}
        </p>
      )}

      {/* ✅ 短い紹介 */}
      {profile.shortBio && (
        <p style={{ marginBottom: "24px", lineHeight: "1.8", color: "#444" }}>
          {profile.shortBio}
        </p>
      )}

      <hr style={{ margin: "40px 0" }} />

      {/* ✅ 本文 */}
      {profile.bio && (
        <div style={{ whiteSpace: "pre-line", lineHeight: "1.9" }}>
          {profile.bio}
        </div>
      )}
    </main>
  );
}