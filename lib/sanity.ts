import { createClient } from "@sanity/client";

export const dynamic = "force-dynamic";
export const client = createClient({
  projectId: "tgv066pc",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});