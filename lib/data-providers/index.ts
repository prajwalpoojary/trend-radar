import type { DataProvider } from "@/lib/types";
import { DemoDataProvider } from "@/lib/data-providers/demo-data-provider";
import { InstagramDataProvider } from "@/lib/data-providers/instagram-data-provider";

export function getDataProvider(): DataProvider {
  // Flip via env var once a real pilot account is connected. Nothing in
  // app/ or components/ needs to change when this switches.
  const source = process.env.TREND_DATA_SOURCE ?? "demo";
  return source === "instagram" ? new InstagramDataProvider() : new DemoDataProvider();
}
