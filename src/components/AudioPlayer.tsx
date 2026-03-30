// Waveform bar heights for visual decoration
const BARS = [8, 12, 16, 10, 14, 6, 12, 18, 10, 14, 8, 12, 16, 10, 14, 6, 12, 18, 10, 14];

interface AudioPlayerProps {
  label: string;
  sublabel?: string;
  url: string | null;
  accent?: 'primary' | 'secondary';
  badge?: string;
}

export default function AudioPlayer({ label, sublabel, url, accent = 'primary', badge }: AudioPlayerProps) {
  if (!url) return null;

  const isSecondary = accent === 'secondary';
  const barColor = isSecondary ? '#00e3fd' : 'white';
  const barOpacity = isSecondary ? 1 : 0.4;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span
          className="font-label text-xs uppercase tracking-widest font-bold"
          style={{ color: isSecondary ? '#00e3fd' : '#adaaaa' }}
        >
          {label}
        </span>
        {badge && (
          <span
            className="font-headline text-sm font-bold"
            style={{ color: isSecondary ? '#00e3fd' : 'white' }}
          >
            {badge}
          </span>
        )}
      </div>
      {/* Waveform visualization */}
      <div
        className="h-24 rounded-xl flex items-center px-4 relative overflow-hidden"
        style={{
          backgroundColor: '#131313',
          border: isSecondary ? '1px solid rgba(0,227,253,0.2)' : 'none',
        }}
      >
        <div className="w-full flex items-center justify-between gap-1" style={{ opacity: barOpacity }}>
          {BARS.map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full flex-1"
              style={{ height: `${h * 4}px`, backgroundColor: barColor, maxWidth: '6px' }}
            />
          ))}
        </div>
        {isSecondary && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,227,253,0.05)' }}>
          </div>
        )}
      </div>
      {/* Audio player */}
      {sublabel && <p className="text-xs text-on-surface-variant">{sublabel}</p>}
      <audio controls src={url} className="w-full h-8 opacity-70" style={{ filter: 'invert(0)' }} />
    </div>
  );
}

