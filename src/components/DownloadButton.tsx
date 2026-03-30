interface DownloadButtonProps {
  url: string;
  filename: string;
}

export default function DownloadButton({ url, filename }: DownloadButtonProps) {
  return (
    <a
      href={url}
      download={filename}
      className="w-full md:w-auto px-10 py-4 font-headline font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
      style={{
        backgroundColor: '#00e3fd',
        color: '#004d57',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>download</span>
      ファイルを保存
    </a>
  );
}

