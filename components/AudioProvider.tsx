"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { config } from "@/lib/config";
import { beatDurationMs, beatIndexAt } from "@/lib/beat";
import { clamp } from "@/lib/format";

export type Levels = {
  bass: number;
  mid: number;
  high: number;
  energy: number;
};

type AudioContextValue = {
  isPlaying: boolean;
  isReady: boolean;
  isMuted: boolean;
  isDemo: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  beat: number;
  analyser: AnalyserNode | null;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  seek: (seconds: number) => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
  duck: (amount?: number, holdMs?: number) => void;
  playChime: () => void;
  previous: () => void;
  next: () => void;
  getLevels: () => Levels;
  getFrequencyData: () => Uint8Array;
  getBins: (count?: number) => number[];
};

const AudioCtx = createContext<AudioContextValue | null>(null);

const BASE_GAIN = 0.88;
const BEAT_SECONDS = beatDurationMs(config.track.bpm) / 1000;

function getAudioContextConstructor() {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext ??
    null
  );
}

function chooseBestSource(audio: HTMLAudioElement) {
  // MP3 first for universality, M4A if MP3 is unsupported.
  const mp3 = audio.canPlayType("audio/mpeg");
  if (mp3) return config.track.audio.mp3;
  return config.track.audio.m4a;
}

function makeDemoLevels(time: number): Levels {
  const phase = (time / BEAT_SECONDS) % 1;
  const kick = Math.exp(-phase * 7);
  const offbeat = ((time / (BEAT_SECONDS * 2)) + 0.5) % 1;
  const snare = Math.exp(-offbeat * 10);
  const shimmer = 0.5 + 0.5 * Math.sin(time * 2.2);
  const bass = clamp(0.26 + kick * 0.62 + 0.05 * Math.sin(time * 0.7), 0, 1);
  const mid = clamp(0.2 + snare * 0.4 + 0.16 * shimmer, 0, 1);
  const high = clamp(0.12 + 0.3 * Math.abs(Math.sin(time * 5.4)) * (0.5 + kick), 0, 1);
  return { bass, mid, high, energy: (bass + mid + high) / 3 };
}

function makeDemoBins(count: number, time: number) {
  const bins = new Array<number>(count);
  const phase = (time / BEAT_SECONDS) % 1;
  for (let i = 0; i < count; i++) {
    const x = i / (count - 1);
    const tilt = Math.pow(1 - x, 1.7);
    const wobble = 0.55 + 0.45 * Math.sin(time * (2.2 + i * 0.23) + i * 0.9);
    const kick = Math.exp(-phase * 8) * (1 - x) * 1.1;
    bins[i] = clamp((tilt * 0.55 + wobble * 0.28 + kick * 0.5) * 255, 4, 255);
  }
  return bins;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTimeState] = useState(0);
  const [duration, setDuration] = useState<number>(config.track.duration);
  const [beat, setBeat] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const levelsRef = useRef<Levels>({ bass: 0, mid: 0, high: 0, energy: 0 });
  const currentTimeRef = useRef(0);
  const durationRef = useRef<number>(config.track.duration);
  const playingRef = useRef(false);
  const mutedRef = useRef(false);
  const wantsPlayRef = useRef(false);
  const demoRef = useRef(false);
  const demoBaseRef = useRef(0);
  const demoStartedAtRef = useRef(0);
  const fallbackTriedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastUiRef = useRef(0);
  const lastBeatRef = useRef(-1);
  const lastLoopRef = useRef(0);
  const duckRef = useRef(1);
  const duckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  const commitTime = useCallback((t: number) => {
    currentTimeRef.current = t;
    setCurrentTimeState(t);
  }, []);

  const applyGain = useCallback((immediate = false) => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;
    const target = mutedRef.current ? 0 : BASE_GAIN * duckRef.current;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    if (immediate) gain.gain.setValueAtTime(target, now);
    else gain.gain.setTargetAtTime(target, now, 0.05);
  }, []);

  const demoTimeNow = useCallback(() => {
    if (!demoRef.current) return currentTimeRef.current;
    const elapsed =
      demoStartedAtRef.current > 0
        ? (performance.now() - demoStartedAtRef.current) / 1000
        : 0;
    const d = durationRef.current || config.track.duration;
    return (demoBaseRef.current + elapsed) % d;
  }, []);

  const enterDemo = useCallback(
    (reason: string) => {
      if (demoRef.current) return;
      demoRef.current = true;
      demoBaseRef.current = currentTimeRef.current;
      demoStartedAtRef.current =
        playingRef.current || wantsPlayRef.current ? performance.now() : 0;
      setIsDemo(true);
      setError(reason);
      setIsReady(true);
      setDuration(config.track.duration);
      durationRef.current = config.track.duration;
      audioRef.current?.pause();
      if (wantsPlayRef.current || playingRef.current) {
        playingRef.current = true;
        setIsPlaying(true);
      }
    },
    [],
  );

  const ensureGraph = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (ctxRef.current && audioRef.current && gainRef.current) {
      if (ctxRef.current.state === "suspended") {
        await ctxRef.current.resume().catch(() => {});
      }
      return;
    }
    if (initPromiseRef.current) return initPromiseRef.current;

    const promise = (async () => {
      try {
        const Ctor = getAudioContextConstructor();
        if (!Ctor) {
          enterDemo("Web Audio is not available in this browser.");
          return;
        }
        const ctx = new Ctor();
        ctxRef.current = ctx;

        const audio = new Audio();
        audio.preload = "auto";
        audio.loop = true;
        audio.setAttribute("playsinline", "true");
        audio.src = chooseBestSource(audio);
        audioRef.current = audio;

        const source = ctx.createMediaElementSource(audio);
        const node = ctx.createAnalyser();
        node.fftSize = 256;
        node.smoothingTimeConstant = 0.8;
        node.minDecibels = -88;
        node.maxDecibels = -18;
        analyserRef.current = node;
        setAnalyser(node);

        const gain = ctx.createGain();
        gain.gain.value = mutedRef.current ? 0 : BASE_GAIN;
        gainRef.current = gain;

        source.connect(node);
        node.connect(gain);
        gain.connect(ctx.destination);

        const onMeta = () => {
          const d = Number.isFinite(audio.duration) ? audio.duration : config.track.duration;
          durationRef.current = d;
          setDuration(d);
          setIsReady(true);
        };
        const onPlaying = () => setIsReady(true);
        const onError = () => {
          if (!fallbackTriedRef.current) {
            fallbackTriedRef.current = true;
            audio.src = config.track.audio.m4a;
            audio.load();
            if (wantsPlayRef.current || playingRef.current) {
              audio.play().catch(() => {
                enterDemo(
                  "The studio master could not be loaded — running a silent, beat-locked preview.",
                );
              });
            }
            return;
          }
          enterDemo(
            "The studio master could not be loaded — running a silent, beat-locked preview.",
          );
        };
        audio.addEventListener("loadedmetadata", onMeta);
        audio.addEventListener("playing", onPlaying);
        audio.addEventListener("error", onError);

        await ctx.resume().catch(() => {});
      } catch (err) {
        console.warn("[AudioProvider]", err);
        enterDemo("Audio could not start in this browser — preview clock is running.");
      }
    })();

    initPromiseRef.current = promise;
    try {
      await promise;
    } finally {
      initPromiseRef.current = null;
    }
  }, [enterDemo]);

  const play = useCallback(async () => {
    wantsPlayRef.current = true;
    if (demoRef.current) {
      demoStartedAtRef.current = performance.now();
      demoBaseRef.current = currentTimeRef.current;
      playingRef.current = true;
      setIsPlaying(true);
      return;
    }
    try {
      await ensureGraph();
      if (demoRef.current) {
        demoStartedAtRef.current = performance.now();
        demoBaseRef.current = currentTimeRef.current;
        playingRef.current = true;
        setIsPlaying(true);
        return;
      }
      const audio = audioRef.current;
      const ctx = ctxRef.current;
      if (!audio || !ctx) {
        enterDemo("Audio graph unavailable — preview clock is running.");
        return;
      }
      if (ctx.state === "suspended") await ctx.resume();
      await audio.play();
      playingRef.current = true;
      setIsPlaying(true);
      setIsReady(true);
      setError(null);
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError") {
        setError("Tap anywhere to allow audio.");
        wantsPlayRef.current = false;
        setIsPlaying(false);
      } else {
        enterDemo("The studio master could not start — preview clock is running.");
      }
    }
  }, [ensureGraph, enterDemo]);

  const pause = useCallback(() => {
    wantsPlayRef.current = false;
    if (demoRef.current) {
      const t = demoTimeNow();
      demoBaseRef.current = t;
      demoStartedAtRef.current = 0;
      commitTime(t);
    } else if (audioRef.current) {
      audioRef.current.pause();
      commitTime(audioRef.current.currentTime || currentTimeRef.current);
    }
    playingRef.current = false;
    setIsPlaying(false);
    levelsRef.current = { bass: 0, mid: 0, high: 0, energy: 0 };
  }, [commitTime, demoTimeNow]);

  const toggle = useCallback(async () => {
    if (playingRef.current) pause();
    else await play();
  }, [pause, play]);

  const seek = useCallback(
    (seconds: number) => {
      const d = durationRef.current || config.track.duration;
      const t = clamp(seconds, 0, Math.max(0, d - 0.05));
      if (demoRef.current) {
        demoBaseRef.current = t;
        if (demoStartedAtRef.current > 0) demoStartedAtRef.current = performance.now();
      } else if (audioRef.current) {
        try {
          audioRef.current.currentTime = t;
        } catch {
          /* noop */
        }
      }
      commitTime(t);
      lastLoopRef.current = t;
    },
    [commitTime],
  );

  const mute = useCallback(() => {
    mutedRef.current = true;
    setIsMuted(true);
    applyGain(true);
  }, [applyGain]);

  const unmute = useCallback(() => {
    mutedRef.current = false;
    setIsMuted(false);
    applyGain(true);
  }, [applyGain]);

  const toggleMute = useCallback(() => {
    if (mutedRef.current) unmute();
    else mute();
  }, [mute, unmute]);

  const duck = useCallback(
    (amount = 0.22, holdMs = 1800) => {
      duckRef.current = amount;
      applyGain();
      if (duckTimerRef.current) clearTimeout(duckTimerRef.current);
      duckTimerRef.current = setTimeout(() => {
        duckRef.current = 1;
        applyGain();
      }, holdMs);
    },
    [applyGain],
  );

  const playChime = useCallback(() => {
    if (typeof window === "undefined") return;
    const Ctor = getAudioContextConstructor();
    if (!Ctor) return;
    let ctx = ctxRef.current;
    let temporary: AudioContext | null = null;
    if (!ctx) {
      try {
        temporary = new Ctor();
        ctx = temporary;
      } catch {
        return;
      }
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const now = ctx.currentTime + 0.02;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.16, now + 0.04);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
    master.connect(ctx.destination);

    const notes = [1046.5, 1318.51, 1567.98];
    notes.forEach((freq, i) => {
      const osc = ctx!.createOscillator();
      const noteGain = ctx!.createGain();
      const start = now + i * 0.075;
      osc.type = i === 2 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, start);
      noteGain.gain.setValueAtTime(0.0001, start);
      noteGain.gain.exponentialRampToValueAtTime(0.4 - i * 0.08, start + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.95);
      osc.connect(noteGain);
      noteGain.connect(master);
      osc.start(start);
      osc.stop(start + 1.05);
    });

    // A soft sub thump makes it feel like a device speaker.
    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.frequency.setValueAtTime(180, now);
    thump.frequency.exponentialRampToValueAtTime(80, now + 0.18);
    thumpGain.gain.setValueAtTime(0.2, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    thump.connect(thumpGain);
    thumpGain.connect(master);
    thump.start(now);
    thump.stop(now + 0.3);

    duck(0.24, 1700);
    if (temporary) setTimeout(() => temporary?.close().catch(() => {}), 2200);
  }, [duck]);

  const getLevels = useCallback(() => levelsRef.current, []);

  const getFrequencyData = useCallback(() => {
    const node = analyserRef.current;
    if (node) {
      if (!dataRef.current || dataRef.current.length !== node.frequencyBinCount) {
        dataRef.current = new Uint8Array(node.frequencyBinCount);
      }
      node.getByteFrequencyData(dataRef.current);
      return dataRef.current;
    }
    // Silent/demo fallback
    const bins = makeDemoBins(64, demoTimeNow());
    const out = new Uint8Array(bins.length);
    for (let i = 0; i < bins.length; i++) out[i] = Math.round(bins[i]);
    return out;
  }, [demoTimeNow]);

  const getBins = useCallback(
    (count = 5) => {
      const time = demoTimeNow();
      const node = analyserRef.current;
      if (!node || demoRef.current) {
        const demo = makeDemoBins(count, time);
        return demo.map((v) => v / 255);
      }
      if (!dataRef.current || dataRef.current.length !== node.frequencyBinCount) {
        dataRef.current = new Uint8Array(node.frequencyBinCount);
      }
      node.getByteFrequencyData(dataRef.current);
      const data = dataRef.current;
      const usable = Math.floor(data.length * 0.72);
      const bands: number[] = [];
      for (let i = 0; i < count; i++) {
        // logarithmic-ish sampling so lows don't dominate the whole bar strip
        const start = Math.floor(Math.pow(i / count, 1.6) * usable);
        const end = Math.max(start + 1, Math.floor(Math.pow((i + 1) / count, 1.6) * usable));
        let sum = 0;
        for (let j = start; j < end; j++) sum += data[j];
        const avg = sum / (end - start) / 255;
        bands.push(clamp(Math.pow(avg, 0.72) * 1.18, 0.03, 1));
      }
      return bands;
    },
    [demoTimeNow],
  );

  // Playback clock: drives progress, beat indices, and analyser levels.
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      levelsRef.current = { bass: 0, mid: 0, high: 0, energy: 0 };
      return;
    }

    if (demoRef.current && demoStartedAtRef.current === 0) {
      demoStartedAtRef.current = performance.now();
    }

    const loop = (now: number) => {
      let t = 0;
      if (demoRef.current) {
        const elapsed =
          demoStartedAtRef.current > 0
            ? (now - demoStartedAtRef.current) / 1000
            : 0;
        const d = durationRef.current || config.track.duration;
        t = (demoBaseRef.current + elapsed) % d;
        currentTimeRef.current = t;
        const levels = makeDemoLevels(t);
        levelsRef.current = {
          bass: levelsRef.current.bass * 0.45 + levels.bass * 0.55,
          mid: levelsRef.current.mid * 0.45 + levels.mid * 0.55,
          high: levelsRef.current.high * 0.45 + levels.high * 0.55,
          energy: levels.energy,
        };
      } else {
        const audio = audioRef.current;
        if (audio) {
          t = audio.currentTime || 0;
          if (t + 0.4 < lastLoopRef.current) {
            t = 0;
          }
          currentTimeRef.current = t;
          const node = analyserRef.current;
          if (node) {
            if (!dataRef.current || dataRef.current.length !== node.frequencyBinCount) {
              dataRef.current = new Uint8Array(node.frequencyBinCount);
            }
            node.getByteFrequencyData(dataRef.current);
            const data = dataRef.current;
            const bucket = (from: number, to: number) => {
              let sum = 0;
              const end = Math.min(to, data.length);
              for (let i = from; i < end; i++) sum += data[i];
              return sum / Math.max(1, end - from) / 255;
            };
            const bass = clamp(Math.pow(bucket(1, 8) * 1.75, 0.8), 0, 1);
            const mid = clamp(Math.pow(bucket(9, 38) * 2.1, 0.85), 0, 1);
            const high = clamp(Math.pow(bucket(39, 96) * 2.4, 0.9), 0, 1);
            levelsRef.current = {
              bass: levelsRef.current.bass * 0.55 + bass * 0.45,
              mid: levelsRef.current.mid * 0.55 + mid * 0.45,
              high: levelsRef.current.high * 0.55 + high * 0.45,
              energy: (bass + mid + high) / 3,
            };
          }
        }
      }

      lastLoopRef.current = t;

      if (now - lastUiRef.current > 120) {
        lastUiRef.current = now;
        setCurrentTimeState(t);
      }

      const idx = beatIndexAt(t * 1000, config.track.bpm);
      if (idx !== lastBeatRef.current) {
        lastBeatRef.current = idx;
        setBeat(idx);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (duckTimerRef.current) clearTimeout(duckTimerRef.current);
      audioRef.current?.pause();
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  const previous = useCallback(() => seek(0), [seek]);
  const next = useCallback(() => seek(0), [seek]);

  const value = useMemo<AudioContextValue>(
    () => ({
      isPlaying,
      isReady,
      isMuted,
      isDemo,
      error,
      currentTime,
      duration,
      beat,
      analyser,
      play,
      pause,
      toggle,
      seek,
      mute,
      unmute,
      toggleMute,
      duck,
      playChime,
      previous,
      next,
      getLevels,
      getFrequencyData,
      getBins,
    }),
    [
      isPlaying,
      isReady,
      isMuted,
      isDemo,
      error,
      currentTime,
      duration,
      beat,
      analyser,
      play,
      pause,
      toggle,
      seek,
      mute,
      unmute,
      toggleMute,
      duck,
      playChime,
      previous,
      next,
      getLevels,
      getFrequencyData,
      getBins,
    ],
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}
