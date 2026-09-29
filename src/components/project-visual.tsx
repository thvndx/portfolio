import type { ProjectVisual as ProjectVisualType } from "@/data/projects";

export function ProjectVisual({ type, compact = false }: { type: ProjectVisualType; compact?: boolean }) {
  return (
    <div className={`project-visual visual-${type} ${compact ? "visual-compact" : ""}`} aria-hidden="true">
      <div className="visual-top"><span /><span /><span /><b>{labelFor(type)}</b></div>
      {type === "quality" && <div className="quality-ui"><div className="score-ring">92<span>quality</span></div><div className="metric-list"><i style={{ "--w": "88%" } as React.CSSProperties} /><i style={{ "--w": "72%" } as React.CSSProperties} /><i style={{ "--w": "94%" } as React.CSSProperties} /></div></div>}
      {type === "workbench" && <div className="workbench-ui"><div className="identity-row"><span>CM</span><div><b>Customer match</b><small>Verified across 3 sources</small></div></div><div className="timeline"><i /><i /><i /></div><button>Next safe action</button></div>}
      {type === "performance" && <div className="performance-ui"><div className="mini-metrics"><b>94%</b><b>01:42</b><b>128</b></div><div className="chart"><i /><i /><i /><i /><i /><i /><i /></div></div>}
      {type === "campaign" && <div className="campaign-ui"><div className="brief-card"><small>Campaign brief</small><b>Launch week</b><span>4 approved posts</span></div><div className="post-stack"><i /><i /><i /></div></div>}
      {type === "mobile" && <div className="mobile-ui"><div className="phone"><small>Today</small><b>A workable day</b><i /><i /><i /><button>Recalibrate</button></div></div>}
      {!["quality", "workbench", "performance", "campaign", "mobile"].includes(type) && <div className="archive-ui"><div className="archive-orb" /><div><i /><i /><i /></div></div>}
    </div>
  );
}

function labelFor(type: ProjectVisualType) {
  const labels: Record<ProjectVisualType, string> = { quality: "QA overview", workbench: "Customer view", performance: "Performance", campaign: "Campaign", mobile: "Daily plan", experience: "Experience", returns: "Returns", marketplace: "Marketplace", storefront: "Storefront", event: "Event" };
  return labels[type];
}
