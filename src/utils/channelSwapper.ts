import type { AudioData } from './audioData';

/**
 * Swap left (channel 0) and right (channel 1) channels.
 * Returns a plain AudioData object (no Web Audio API needed).
 */
export function swapChannels(buffer: AudioData): AudioData {
  const numChannels = buffer.numberOfChannels;
  const channels: Float32Array[] = [];

  if (numChannels >= 2) {
    channels.push(new Float32Array(buffer.getChannelData(1))); // R → L
    channels.push(new Float32Array(buffer.getChannelData(0))); // L → R
    for (let ch = 2; ch < numChannels; ch++) {
      channels.push(new Float32Array(buffer.getChannelData(ch)));
    }
  } else {
    channels.push(new Float32Array(buffer.getChannelData(0)));
  }

  return {
    numberOfChannels: numChannels,
    sampleRate: buffer.sampleRate,
    length: buffer.length,
    getChannelData: (ch: number) => channels[ch],
  };
}
