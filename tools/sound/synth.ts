// Synthesises the app's four cue sounds (T2.16).
//
// WAV is written by hand rather than with an audio library: the format's
// header is 44 bytes and the body is raw samples, so a dependency would buy
// nothing. 16-bit mono, under 25 KB each (ARCHITECTURE §9).

// 22.05 kHz, not 44.1. ARCHITECTURE 9 asks for both 44.1 kHz and under 25 KB,
// which together cap every sound at 0.29 s — too short for a completion
// chime. The highest tone here is 1568 Hz, so 22.05 kHz sits far above the
// 3.1 kHz Nyquist needs and halves the file.
const SAMPLE_RATE = 22_050;
const BITS = 16;
const PEAK = 2 ** (BITS - 1) - 1;

export interface Tone {
  /** Hertz. */
  frequency: number;
  /** Seconds. */
  duration: number;
  /** 0 to 1, before the envelope. */
  gain?: number;
  /** Silence before this tone, in seconds. */
  delay?: number;
}

/**
 * A short fade in and out on every tone. Without it the waveform starts and
 * ends mid-cycle, and the speaker reproduces that step as an audible click —
 * which is very noticeable on a beep that plays three times before every rep.
 */
function envelope(index: number, total: number): number {
  const fade = Math.min(Math.floor(SAMPLE_RATE * 0.006), Math.floor(total / 2));
  if (index < fade) return index / fade;
  if (index > total - fade) return (total - index) / fade;
  return 1;
}

/** Sine with a little second harmonic, which carries better on a phone speaker. */
function sample(phase: number): number {
  return Math.sin(phase) * 0.82 + Math.sin(phase * 2) * 0.18;
}

function renderTones(tones: Tone[]): Float32Array {
  const totalSeconds = tones.reduce((sum, tone) => sum + (tone.delay ?? 0) + tone.duration, 0);
  const out = new Float32Array(Math.ceil(totalSeconds * SAMPLE_RATE));

  let cursor = 0;
  for (const tone of tones) {
    cursor += Math.floor((tone.delay ?? 0) * SAMPLE_RATE);
    const length = Math.floor(tone.duration * SAMPLE_RATE);
    const gain = tone.gain ?? 1;

    for (let i = 0; i < length; i++) {
      const phase = (2 * Math.PI * tone.frequency * i) / SAMPLE_RATE;
      out[cursor + i] = (out[cursor + i] ?? 0) + sample(phase) * gain * envelope(i, length);
    }
    cursor += length;
  }

  return out;
}

/** Packs samples into a 16-bit mono WAV, header and all. */
export function toWav(samples: Float32Array): Buffer {
  const body = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const clipped = Math.max(-1, Math.min(1, samples[i] ?? 0));
    body.writeInt16LE(Math.round(clipped * PEAK), i * 2);
  }

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + body.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE((SAMPLE_RATE * BITS) / 8, 28); // byte rate
  header.writeUInt16LE(BITS / 8, 32); // block align
  header.writeUInt16LE(BITS, 34);
  header.write('data', 36);
  header.writeUInt32LE(body.length, 40);

  return Buffer.concat([header, body]);
}

/**
 * The four cues the player needs (ARCHITECTURE §9). They are deliberately
 * plain: these play during exercise, often on repeat, so anything musical
 * would wear out fast.
 */
export const SOUNDS: Record<string, Tone[]> = {
  // Counted into the last three seconds of a work or rest phase.
  beep_short: [{ frequency: 880, duration: 0.09, gain: 0.55 }],
  // Marks the moment a phase changes, a tone lower and longer so it is
  // distinguishable from the count-in without looking at the screen.
  beep_long: [{ frequency: 660, duration: 0.24, gain: 0.6 }],
  // Workout finished: a rising third.
  complete: [
    { frequency: 660, duration: 0.14, gain: 0.5 },
    { frequency: 880, duration: 0.14, gain: 0.5, delay: 0.02 },
    { frequency: 1174, duration: 0.22, gain: 0.5, delay: 0.02 },
  ],
  // Badge unlocked: brighter, and clearly not the finish sound.
  achievement: [
    { frequency: 784, duration: 0.1, gain: 0.45 },
    { frequency: 1046, duration: 0.1, gain: 0.45, delay: 0.015 },
    { frequency: 1318, duration: 0.1, gain: 0.45, delay: 0.015 },
    { frequency: 1568, duration: 0.2, gain: 0.45, delay: 0.015 },
  ],
};

export function renderSound(name: keyof typeof SOUNDS | string): Buffer {
  const tones = SOUNDS[name];
  if (!tones) throw new Error(`No sound named "${name}"`);
  return toWav(renderTones(tones));
}
