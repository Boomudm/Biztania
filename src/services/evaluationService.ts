import { reports } from "../data/reports";
import { buildDemoCluster } from "./clusteringService";

const expectedPb024 = new Set([
  "R-101",
  "R-102",
  "R-103",
  "R-104",
  "R-105",
  "R-106",
  "R-107",
  "R-108",
]);

export type ClusterEvaluation = {
  datasetSize: number;
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  trueNegative: number;
  precision: number;
  recall: number;
  f1: number;
  scopeLabelTh: string;
};

const percent = (value: number) => Math.round(value * 100);

export function evaluateDemoCluster(): ClusterEvaluation {
  const predicted = new Set(
    buildDemoCluster(reports).map((report) => report.id),
  );
  let truePositive = 0,
    falsePositive = 0,
    falseNegative = 0,
    trueNegative = 0;

  reports.forEach((report) => {
    const expected = expectedPb024.has(report.id);
    const actual = predicted.has(report.id);
    if (expected && actual) truePositive += 1;
    else if (!expected && actual) falsePositive += 1;
    else if (expected && !actual) falseNegative += 1;
    else trueNegative += 1;
  });

  const precision = truePositive / Math.max(1, truePositive + falsePositive);
  const recall = truePositive / Math.max(1, truePositive + falseNegative);
  const f1 =
    (2 * precision * recall) / Math.max(Number.EPSILON, precision + recall);

  return {
    datasetSize: reports.length,
    truePositive,
    falsePositive,
    falseNegative,
    trueNegative,
    precision: percent(precision),
    recall: percent(recall),
    f1: percent(f1),
    scopeLabelTh:
      "ชุดข้อมูลจำลองที่ติดป้ายกำกับ 25 รายงาน · Regression test ไม่ใช่ผลประเมินภาคสนาม",
  };
}
