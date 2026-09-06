import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card. Built from flat colour and type rather than a photograph so it
 * stays legible at thumbnail size in a chat preview.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#080605",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#e6b177",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: 48, height: 2, background: "#e6b177" }} />
          Est. 2019 — Tashkent
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 104,
            lineHeight: 1.02,
            color: "#fbf8f3",
            letterSpacing: -3,
            maxWidth: 900,
          }}
        >
          Coffee worth slowing down for.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(244,237,226,0.15)",
            paddingTop: 28,
            color: "#d6c4a8",
            fontSize: 26,
          }}
        >
          <div style={{ display: "flex", color: "#fbf8f3" }}>{site.name}</div>
          <div style={{ display: "flex" }}>{site.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
