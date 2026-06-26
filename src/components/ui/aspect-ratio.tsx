import * as React from "react"

const AspectRatio = ({ ratio = 4 / 3, children }: { ratio?: number; children: React.ReactNode }) => (
  <div style={{ position: "relative", width: "100%", paddingBottom: `${(1 / ratio) * 100}%` }}>
    <div style={{ position: "absolute", inset: 0 }}>{children}</div>
  </div>
)

export { AspectRatio }
