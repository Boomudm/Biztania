import { describe, expect, it } from "vitest";
import { anchor, reports } from "../data/reports";
import {
  buildDemoCluster,
  distanceMeters,
  similarity,
} from "./clusteringService";
import { assessRisk } from "./riskService";
import { evaluateDemoCluster } from "./evaluationService";

describe("deterministic demo intelligence", () => {
  it("groups the eight nearby reports but excludes unrelated reports", () => {
    const cluster = buildDemoCluster(reports);
    expect(reports).toHaveLength(25);
    expect(cluster).toHaveLength(8);
    expect(cluster.map((r) => r.id)).not.toContain("R-201");
    expect(cluster.map((r) => r.id)).not.toContain("R-301");
  });

  it("produces the transparent competition-demo score", () => {
    const result = assessRisk(buildDemoCluster(reports));
    expect(result.score).toBe(87);
    expect(result.level).toBe("High");
    expect(result.factors.reduce((sum, factor) => sum + factor.points, 0)).toBe(
      87,
    );
  });

  it("scores distant, unrelated reports below nearby reports", () => {
    const nearby = reports.find((r) => r.id === "R-107")!;
    const distant = reports.find((r) => r.id === "R-201")!;
    expect(distanceMeters(anchor, nearby)).toBeLessThan(500);
    expect(similarity(anchor, nearby).total).toBeGreaterThan(
      similarity(anchor, distant).total,
    );
  });

  it("publishes reproducible clustering metrics for the labeled demo dataset", () => {
    const result = evaluateDemoCluster();
    expect(result.datasetSize).toBe(25);
    expect(result.truePositive).toBe(8);
    expect(result.falsePositive).toBe(0);
    expect(result.falseNegative).toBe(0);
    expect(result.f1).toBe(100);
    expect(result.scopeLabelTh).toContain("ไม่ใช่ผลประเมินภาคสนาม");
  });
});
