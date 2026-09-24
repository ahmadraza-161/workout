import { renderSound, SOUNDS, toWav } from './synth.ts';

// A malformed WAV header plays as silence or noise rather than throwing, so
// these check the bytes rather than trusting that it sounded fine once.

const readHeader = (wav: Buffer) => ({
  riff: wav.toString('ascii', 0, 4),
  wave: wav.toString('ascii', 8, 12),
  fmt: wav.toString('ascii', 12, 16),
  audioFormat: wav.readUInt16LE(20),
  channels: wav.readUInt16LE(22),
  sampleRate: wav.readUInt32LE(24),
  byteRate: wav.readUInt32LE(28),
  blockAlign: wav.readUInt16LE(32),
  bitsPerSample: wav.readUInt16LE(34),
  data: wav.toString('ascii', 36, 40),
  dataSize: wav.readUInt32LE(40),
});

describe('toWav', () => {
  it('writes a valid 16-bit mono PCM header', () => {
    const header = readHeader(toWav(new Float32Array(1000)));

    expect(header.riff).toBe('RIFF');
    expect(header.wave).toBe('WAVE');
    expect(header.fmt).toBe('fmt ');
    expect(header.data).toBe('data');
    expect(header.audioFormat).toBe(1);
    expect(header.channels).toBe(1);
    expect(header.bitsPerSample).toBe(16);
    expect(header.blockAlign).toBe(2);
    expect(header.byteRate).toBe(header.sampleRate * 2);
  });

  it('declares a data size that matches the bytes actually written', () => {
    const wav = toWav(new Float32Array(1000));
    expect(wav.readUInt32LE(40)).toBe(2000);
    expect(wav.length).toBe(44 + 2000);
    expect(wav.readUInt32LE(4)).toBe(wav.length - 8);
  });

  it('clips rather than wrapping, so an overdriven sample cannot invert', () => {
    const wav = toWav(new Float32Array([2, -2]));
    expect(wav.readInt16LE(44)).toBe(32767);
    expect(wav.readInt16LE(46)).toBe(-32767);
  });
});

describe('the cue sounds', () => {
  const names = Object.keys(SOUNDS);

  it('covers the four cues the player needs', () => {
    expect(names.sort()).toEqual(['achievement', 'beep_long', 'beep_short', 'complete']);
  });

  it.each(names)('renders %s inside the 25 KB budget', (name) => {
    expect(renderSound(name).length).toBeLessThan(25 * 1024);
  });

  it.each(names)('starts and ends %s at silence, so it cannot click', (name) => {
    const wav = renderSound(name);
    // The envelope fades both ends; a waveform cut mid-cycle would leave a
    // large first or last sample and an audible pop on every beep.
    expect(Math.abs(wav.readInt16LE(44))).toBeLessThan(500);
    expect(Math.abs(wav.readInt16LE(wav.length - 2))).toBeLessThan(500);
  });

  it('keeps every tone well inside what the sample rate can carry', () => {
    const sampleRate = readHeader(renderSound('beep_short')).sampleRate;
    const highest = Math.max(...Object.values(SOUNDS).flat().map((tone) => tone.frequency));
    // Nyquist: the rate has to be more than twice the highest frequency, and
    // the second harmonic the synth adds doubles that again.
    expect(sampleRate).toBeGreaterThan(highest * 4);
  });

  it('rejects an unknown sound rather than writing an empty file', () => {
    expect(() => renderSound('nope')).toThrow('No sound named');
  });
});
