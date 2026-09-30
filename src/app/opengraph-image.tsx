import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0d0e11",
          backgroundImage:
            "radial-gradient(60% 55% at 50% 110%, rgba(227,154,95,0.28) 0%, rgba(227,154,95,0.05) 50%, transparent 75%)",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ width: 12, height: 22, borderRadius: 3, background: "#b9b4aa" }} />
            <div style={{ width: 12, height: 22, borderRadius: 3, background: "#9ab4c9" }} />
            <div style={{ width: 12, height: 22, borderRadius: 3, background: "#d8c8a5" }} />
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#f4f1ea" }}>
            {siteConfig.name}
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#7d7970", letterSpacing: 4, marginLeft: 12 }}>
            ROBINHOOD CHAIN · TOKENIZED STOCKS
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 112, lineHeight: 1, color: "#f4f1ea", letterSpacing: -2 }}>
            Forge your own
          </div>
          <div style={{ display: "flex", fontSize: 112, lineHeight: 1, color: "#e39a5f", fontStyle: "italic", letterSpacing: -2 }}>
            portfolio.
          </div>
          <div style={{ display: "flex", marginTop: 34, fontSize: 28, color: "#b9b4aa", fontFamily: "sans-serif" }}>
            Backed one-for-one · Redeem any time · One signature · Non-custodial
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
