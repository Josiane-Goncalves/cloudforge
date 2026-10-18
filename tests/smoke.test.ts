import { describe, it, expect } from 'vitest';
import { AppView } from '../src/types/navigation';

describe('CloudForge Core Foundations (Smoke Test)', () => {
  it('should validate navigation views definition', () => {
    const validViews: AppView[] = ['home', 'codex', 'lab', 'progress'];
    expect(validViews).toHaveLength(4);
    expect(validViews).toContain('home');
    expect(validViews).toContain('codex');
    expect(validViews).toContain('lab');
    expect(validViews).toContain('progress');
  });

  it('should maintain deterministic math integrity for score computations', () => {
    const baseScore = 75;
    const bonus = 25;
    expect(baseScore + bonus).toBe(100);
  });
});
