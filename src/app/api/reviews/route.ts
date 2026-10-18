import { connection } from "next/server";
import { getPlaceSummary } from "@/lib/google-places";

// Always runs per request: Google's policy forbids caching Places content.
export async function GET() {
  await connection();
  const summary = await getPlaceSummary();
  return Response.json(summary, { headers: { "Cache-Control": "no-store" } });
}
