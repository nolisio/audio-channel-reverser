import { Mp3Encoder } from '@breezystack/lamejs';
import type { AudioData } from './audioData';

/**
 * Encode an AudioBuffer to MP3 format and return as a Blob.
 * Uses lamejs for encoding.
 */
export function encodeMp3(buffer: AudioData, kbps = 128): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const encoder = new Mp3Encoder(
    Math.min(numChannels, 2),
    sampleRate,
    kbps
  );

  const chunkSize = 1152;
  const mp3Data: Uint8Array<ArrayBuffer>[] = [];

  const leftData = buffer.getChannelData(0);
  const rightData = numChannels >= 2 ? buffer.getChannelData(1) : leftData;

  // Convert Float32 (-1.0 ~ 1.0) to Int16
  const toInt16 = (floatData: Float32Array): Int16Array => {
    const int16 = new Int16Array(floatData.length);
    for (let i = 0; i < floatData.length; i++) {
      const s = Math.max(-1, Math.min(1, floatData[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16;
  };

  const leftInt16 = toInt16(leftData);
  const rightInt16 = toInt16(rightData);

  for (let i = 0; i < leftInt16.length; i += chunkSize) {
    const leftChunk = leftInt16.subarray(i, i + chunkSize);
    const rightChunk = rightInt16.subarray(i, i + chunkSize);
    const mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(new Uint8Array(mp3buf.buffer, mp3buf.byteOffset, mp3buf.byteLength).slice());
    }
  }

  const final = encoder.flush();
  if (final.length > 0) {
    mp3Data.push(new Uint8Array(final.buffer, final.byteOffset, final.byteLength).slice());
  }

  return new Blob(mp3Data, { type: 'audio/mp3' });
}
