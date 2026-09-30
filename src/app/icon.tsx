import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Three bars poured into one ingot, on graphite. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0e11",
          borderRadius: 14,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 18, borderRadius: 3, background: "#b9b4aa" }} />
          <div style={{ width: 10, height: 18, borderRadius: 3, background: "#9ab4c9" }} />
          <div style={{ width: 10, height: 18, borderRadius: 3, background: "#d8c8a5" }} />
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 5,
            width: 42,
            height: 16,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f5bf8a, #e39a5f 55%, #a8602c)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
