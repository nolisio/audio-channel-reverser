import { useState, useCallback } from 'react';
import { decodeAudioFile } from '../utils/audioDecoder';
import { swapChannels } from '../utils/channelSwapper';
import EncoderWorker from '../workers/encoder.worker?worker';

export type OutputFormat = 'mp3' | 'wav';

export interface ProcessResult {
  blob: Blob;
  url: string;
  filename: string;
  format: OutputFormat;
}

export interface AudioProcessorState {
  isProcessing: boolean;
  progress: number;
  error: string | null;
  result: ProcessResult | null;
  originalUrl: string | null;
}

export function useAudioProcessor() {
  const [state, setState] = useState<AudioProcessorState>({
    isProcessing: false,
    progress: 0,
    error: null,
    result: null,
    originalUrl: null,
  });

  const process = useCallback(async (file: File, format: OutputFormat, outputBaseName?: string) => {
    setState((prev) => ({
      ...prev,
      isProcessing: true,
      progress: 0,
      error: null,
      result: null,
    }));

    const originalUrl = URL.createObjectURL(file);
    setState((prev) => ({ ...prev, originalUrl, progress: 10 }));

    try {
      // Decode audio file
      const audioBuffer = await decodeAudioFile(file);
      setState((prev) => ({ ...prev, progress: 40 }));

      // Swap L/R channels
      const swapped = swapChannels(audioBuffer);
      setState((prev) => ({ ...prev, progress: 60 }));

      // Extract channel data (transferable to worker)
      const channels: Float32Array[] = [];
      for (let ch = 0; ch < swapped.numberOfChannels; ch++) {
        channels.push(swapped.getChannelData(ch));
      }

      // Encode in a Web Worker to avoid blocking the UI
      let blob: Blob;
      try {
        blob = await new Promise<Blob>((resolve, reject) => {
          const worker = new EncoderWorker();
          worker.onmessage = (e: MessageEvent) => {
            if (e.data.type === 'result') {
              worker.terminate();
              resolve(new Blob([e.data.arrayBuffer], { type: e.data.mimeType }));
            } else if (e.data.type === 'error') {
              worker.terminate();
              reject(new Error(e.data.error));
            }
          };
          worker.onerror = (e: ErrorEvent) => {
            worker.terminate();
            reject(new Error(e.message));
          };
          worker.postMessage(
            { format, sampleRate: swapped.sampleRate, numberOfChannels: swapped.numberOfChannels, length: swapped.length, channels },
            channels.map((c) => c.buffer),
          );
        });
      } finally {
        // nothing to clean up here
      }
      setState((prev) => ({ ...prev, progress: 90 }));

      const baseName = (outputBaseName?.trim() || file.name.replace(/\.[^/.]+$/, '') + '_swapped');
      const ext = format === 'mp3' ? 'mp3' : 'wav';
      const filename = `${baseName}.${ext}`;
      const url = URL.createObjectURL(blob);

      setState({
        isProcessing: false,
        progress: 100,
        error: null,
        result: { blob, url, filename, format },
        originalUrl,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        progress: 0,
        error: err instanceof Error ? err.message : '処理中にエラーが発生しました',
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState((prev) => {
      if (prev.result?.url) URL.revokeObjectURL(prev.result.url);
      if (prev.originalUrl) URL.revokeObjectURL(prev.originalUrl);
      return {
        isProcessing: false,
        progress: 0,
        error: null,
        result: null,
        originalUrl: null,
      };
    });
  }, []);

  return { state, process, reset };
}
