/**
 * Tiny, dependency-free BPM clock.
 * All pulses in the UI are derived from the actual audio clock (or the demo
 * clock) so the island, icons and 3D scene never drift.
 */

export const beatDurationMs = (bpm: number) => 60000 / bpm;

/** 135 BPM → 444.44ms */
export const BEAT_MS = beatDurationMs(135);

/** Normalised position inside the current beat, 0 → 1. */
export function beatPhase(timeMs: number, bpm = 135) {
  const beat = beatDurationMs(bpm);
  const phase = (timeMs % beat) / beat;
  return phase < 0 ? phase + 1 : phase;
}

/** Sharp attack + exponential decay envelope for visual pulses. */
export function beatPulse(timeMs: number, bpm = 135, decay = 5) {
  const phase = beatPhase(timeMs, bpm);
  return Math.exp(-phase * decay);
}

export function beatIndexAt(timeMs: number, bpm = 135) {
  return Math.floor(timeMs / beatDurationMs(bpm));
}

/** Milliseconds until the next downbeat — useful for scheduling. */
export function msToNextBeat(timeMs: number, bpm = 135) {
  const beat = beatDurationMs(bpm);
  return beat - (timeMs % beat);
}
