import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.wadahirono-baritone.net";

  // ✅ 固定ページ
  const staticPages = [
    "",
    "/profile",
    "/past-concerts",
    "/repertoire",
    "/gallery",
    "/blog",
    "/contact",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  // ✅ ブログ（演奏サイト）
  const blogPosts = await client.fetch(`
    *[_type == "performanceBlog"]{
      slug,
      publishedAt,
      date
    }
  `);

  const blogPages = blogPosts
    .filter((post: any) => post?.slug?.current)
    .map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug.current}`,
      lastModified: new Date(post.publishedAt || post.date || Date.now()),
    }));

  // ✅ 公演詳細（あれば）
  const concerts = await client.fetch(`
    *[_type == "concert"]{
      slug,
      date
    }
  `);

  const concertPages = concerts
    .filter((c: any) => c?.slug?.current)
    .map((c: any) => ({
      url: `${baseUrl}/concert/${c.slug.current}`,
      lastModified: new Date(c.date || Date.now()),
    }));

  return [...staticPages, ...blogPages, ...concertPages];
}