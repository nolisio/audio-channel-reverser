/// <reference lib="webworker" />

import { encodeMp3 } from '../utils/mp3Encoder';
import { encodeWav } from '../utils/wavEncoder';
import type { AudioData } from '../utils/audioData';

interface WorkerRequest {
  format: 'mp3' | 'wav';
  sampleRate: number;
  numberOfChannels: number;
  length: number;
  channels: Float32Array[];
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { format, sampleRate, numberOfChannels, length, channels } = event.data;

  const audioData: AudioData = {
    numberOfChannels,
    sampleRate,
    length,
    getChannelData: (ch: number) => channels[ch],
  };

  try {
    const blob = format === 'mp3' ? encodeMp3(audioData) : encodeWav(audioData);
    const arrayBuffer = await blob.arrayBuffer();
    self.postMessage({ type: 'result', arrayBuffer, mimeType: blob.type }, [arrayBuffer]);
  } catch (err) {
    self.postMessage({
      type: 'error',
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
