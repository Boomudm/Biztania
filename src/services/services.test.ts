import { describe, expect, it } from 'vitest'
import { anchor, reports } from '../data/reports'
import { buildDemoCluster, distanceMeters, similarity } from './clusteringService'
import { assessRisk } from './riskService'

describe('deterministic demo intelligence', () => {
  it('groups the eight nearby reports but excludes unrelated reports', () => {
    const cluster = buildDemoCluster(reports)
    expect(cluster).toHaveLength(8)
    expect(cluster.map(r => r.id)).not.toContain('R-201')
  })

  it('produces the transparent competition-demo score', () => {
    const result = assessRisk(buildDemoCluster(reports))
    expect(result.score).toBe(87)
    expect(result.level).toBe('High')
    expect(result.factors.reduce((sum, factor) => sum + factor.points, 0)).toBe(87)
  })

  it('scores distant, unrelated reports below nearby reports', () => {
    const nearby = reports.find(r => r.id === 'R-107')!
    const distant = reports.find(r => r.id === 'R-201')!
    expect(distanceMeters(anchor, nearby)).toBeLessThan(500)
    expect(similarity(anchor, nearby).total).toBeGreaterThan(similarity(anchor, distant).total)
  })
})
