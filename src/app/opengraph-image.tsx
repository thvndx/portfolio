import { ImageResponse } from "next/og";

export const alt = "Conold Chisinahama — full-stack software developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "#f1eee8", color: "#17201d", fontFamily: "Arial, sans-serif" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}><b>Conold Chisinahama</b><span>Johannesburg · South Africa</span></div><div style={{ display: "flex", flexDirection: "column", gap: 24 }}><div style={{ fontFamily: "Georgia, serif", fontSize: 76, lineHeight: 1.04, maxWidth: 1020 }}>I turn operational complexity into software teams can trust.</div><div style={{ fontSize: 26, color: "#52605b" }}>Full-stack developer · Customer-success foundation</div></div><div style={{ width: 160, height: 12, background: "#d85a3a" }} /></div>, size);
}
