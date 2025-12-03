/**
 * Mock Data Tests
 * 
 * Tests for mock telemetry generation and utility functions
 */

import { 
  updateTelemetry, 
  clamp, 
  getHealthStatus 
} from '@/lib/content/mockData';
import { 
  DEFAULT_TELEMETRY, 
  TELEMETRY_RANGES,
  TelemetryMetrics 
} from '@/lib/content/schema';

describe('mockData utilities', () => {
  describe('clamp', () => {
    it('should return value if within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('should return min if value is below', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should return max if value is above', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle edge cases', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  describe('getHealthStatus', () => {
    it('should return "healthy" for good metrics', () => {
      const metrics: TelemetryMetrics = {
        ...DEFAULT_TELEMETRY,
        rtt: 10,
        jitter: 2,
        packetLoss: 0.05,
      };
      expect(getHealthStatus(metrics)).toBe('healthy');
    });

    it('should return "warning" for moderate issues', () => {
      const metrics: TelemetryMetrics = {
        ...DEFAULT_TELEMETRY,
        rtt: 20,
        jitter: 4,
        packetLoss: 0.8,
      };
      expect(getHealthStatus(metrics)).toBe('warning');
    });

    it('should return "critical" for severe issues', () => {
      const metrics: TelemetryMetrics = {
        ...DEFAULT_TELEMETRY,
        rtt: 30,
        jitter: 8,
        packetLoss: 3,
      };
      expect(getHealthStatus(metrics)).toBe('critical');
    });
  });

  describe('updateTelemetry', () => {
    it('should update metrics within defined ranges', () => {
      const updated = updateTelemetry(DEFAULT_TELEMETRY, TELEMETRY_RANGES);
      
      // Check all values are within ranges
      expect(updated.rtt).toBeGreaterThanOrEqual(TELEMETRY_RANGES.rtt.min);
      expect(updated.rtt).toBeLessThanOrEqual(TELEMETRY_RANGES.rtt.max);
      
      expect(updated.jitter).toBeGreaterThanOrEqual(TELEMETRY_RANGES.jitter.min);
      expect(updated.jitter).toBeLessThanOrEqual(TELEMETRY_RANGES.jitter.max);
      
      expect(updated.packetLoss).toBeGreaterThanOrEqual(TELEMETRY_RANGES.packetLoss.min);
      expect(updated.packetLoss).toBeLessThanOrEqual(TELEMETRY_RANGES.packetLoss.max);
      
      expect(updated.throughput).toBeGreaterThanOrEqual(TELEMETRY_RANGES.throughput.min);
      expect(updated.throughput).toBeLessThanOrEqual(TELEMETRY_RANGES.throughput.max);
    });

    it('should produce different values on multiple calls', () => {
      const first = updateTelemetry(DEFAULT_TELEMETRY, TELEMETRY_RANGES);
      const second = updateTelemetry(first, TELEMETRY_RANGES);
      
      // At least one value should change (probabilistic, but very likely)
      const changed = 
        first.rtt !== second.rtt ||
        first.jitter !== second.jitter ||
        first.packetLoss !== second.packetLoss ||
        first.throughput !== second.throughput;
      
      expect(changed).toBe(true);
    });

    it('should return valid TelemetryMetrics structure', () => {
      const updated = updateTelemetry(DEFAULT_TELEMETRY, TELEMETRY_RANGES);
      
      expect(typeof updated.rtt).toBe('number');
      expect(typeof updated.jitter).toBe('number');
      expect(typeof updated.packetLoss).toBe('number');
      expect(typeof updated.throughput).toBe('number');
      expect(typeof updated.queueDepth).toBe('number');
      expect(typeof updated.cpuUsage).toBe('number');
    });
  });
});

describe('DEFAULT_TELEMETRY', () => {
  it('should have all required fields', () => {
    expect(DEFAULT_TELEMETRY).toHaveProperty('rtt');
    expect(DEFAULT_TELEMETRY).toHaveProperty('jitter');
    expect(DEFAULT_TELEMETRY).toHaveProperty('packetLoss');
    expect(DEFAULT_TELEMETRY).toHaveProperty('throughput');
    expect(DEFAULT_TELEMETRY).toHaveProperty('queueDepth');
    expect(DEFAULT_TELEMETRY).toHaveProperty('cpuUsage');
  });

  it('should have reasonable default values', () => {
    expect(DEFAULT_TELEMETRY.rtt).toBeGreaterThan(0);
    expect(DEFAULT_TELEMETRY.throughput).toBeGreaterThan(0);
    expect(DEFAULT_TELEMETRY.packetLoss).toBeLessThan(1);
  });
});
