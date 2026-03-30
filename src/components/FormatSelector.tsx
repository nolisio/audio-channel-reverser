import type { OutputFormat } from '../hooks/useAudioProcessor';

interface FormatSelectorProps {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
  disabled?: boolean;
}

export default function FormatSelector({ value, onChange, disabled }: FormatSelectorProps) {
  const formats: { id: OutputFormat; label: string }[] = [
    { id: 'mp3', label: 'MP3' },
    { id: 'wav', label: 'WAV' },
  ];

  return (
    <div className="flex bg-surface-container-low p-1 rounded-lg w-fit">
      {formats.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          disabled={disabled}
          className={`
            px-6 py-2 rounded-md font-bold transition-all
            ${value === f.id
              ? 'bg-primary text-on-primary-container shadow-lg'
              : 'text-on-surface-variant hover:text-white'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
          `}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

