import React, { useRef, useState, useCallback } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function FileUploader({ onFileSelect, disabled }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('音声ファイルを選択してください（MP3, WAV, OGG等）');
      return;
    }
    onFileSelect(file);
  }, [onFileSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [disabled, handleFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <div className="relative group" onClick={() => !disabled && inputRef.current?.click()}>
      {/* Gradient glow border */}
      <div
        className="absolute -inset-px rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-700"
        style={{ background: 'linear-gradient(to right, #b6a0ff, #00e3fd)' }}
      />
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-12 md:p-20 flex flex-col items-center justify-center text-center transition-all cursor-pointer
          ${isDragging
            ? 'border-primary/70 bg-surface-container'
            : 'border-outline-variant/30 bg-surface-container-low hover:border-primary/40'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
          className="hidden"
          disabled={disabled}
        />
        <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '3rem' }}>audio_file</span>
        </div>
        <h3 className="font-headline text-2xl text-white mb-2">
          {isDragging ? 'ここにドロップ！' : 'オーディオファイルをドロップ'}
        </h3>
        <p className="text-on-surface-variant text-base mb-8">
          または、クリックしてコンピュータから選択 (MP3, WAV, FLAC, OGG)
        </p>
        <button
          type="button"
          className="px-10 py-4 bg-surface-container-highest text-white font-medium rounded-xl hover:bg-surface-bright transition-colors text-lg pointer-events-none"
        >
          ファイルを選択
        </button>
      </div>
    </div>
  );
}

