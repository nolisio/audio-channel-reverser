import { useState } from "react";
import FileUploader from "./components/FileUploader";
import AudioPlayer from "./components/AudioPlayer";
import FormatSelector from "./components/FormatSelector";
import DownloadButton from "./components/DownloadButton";
import { useAudioProcessor } from "./hooks/useAudioProcessor";
import type { OutputFormat } from "./hooks/useAudioProcessor";

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>("mp3");
  const [outputBaseName, setOutputBaseName] = useState<string>("");
  const { state, process, reset } = useAudioProcessor();

  const handleFileSelect = (file: File) => {
    reset();
    setSelectedFile(file);
    setOutputBaseName(file.name.replace(/\.[^/.]+$/, "") + "_swapped");
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    await process(selectedFile, format, outputBaseName);
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
    setOutputBaseName("");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0e0e0e", color: "#ffffff" }}
    >
      <main className="flex-grow pt-12">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-16">
          <h1
            className="font-bold mb-6 tracking-tight text-white"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              lineHeight: 1.1,
            }}
          >
            Precision Audio{" "}
            <span className="italic" style={{ color: "#b6a0ff" }}>
              Reversal
            </span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#adaaaa" }}
          >
            ブラウザ完結型の高度な音声処理。左右のステレオチャンネルを瞬時に、かつロスレスで反転させます。
          </p>
        </section>

        {/* Workspace */}
        <div className="max-w-4xl mx-auto px-6 mb-24 space-y-8">
          {/* Uploader */}
          <FileUploader
            onFileSelect={handleFileSelect}
            disabled={state.isProcessing}
          />

          {/* Selected file info */}
          {selectedFile && (
            <div
              className="flex items-center gap-4 px-6 py-4 rounded-xl"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#b6a0ff", fontSize: "1.5rem" }}
              >
                audio_file
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs" style={{ color: "#adaaaa" }}>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!state.isProcessing && (
                <button
                  onClick={handleReset}
                  className="transition-colors"
                  style={{ color: "#767575" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#ffffff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#767575")
                  }
                  aria-label="クリア"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "1.25rem" }}
                  >
                    close
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Controls */}
          <div
            className="rounded-xl p-8"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            {/* Row 1: format + filename */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="space-y-3 shrink-0">
                <label
                  className="font-bold text-xs uppercase tracking-widest block"
                  style={{
                    color: "#adaaaa",
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                >
                  出力フォーマット
                </label>
                <FormatSelector
                  value={format}
                  onChange={setFormat}
                  disabled={state.isProcessing}
                />
              </div>

              {selectedFile && (
                <div className="space-y-3 flex-1 min-w-0">
                  <label
                    className="font-bold text-xs uppercase tracking-widest block"
                    style={{
                      color: "#adaaaa",
                      fontFamily: '"Space Grotesk", sans-serif',
                    }}
                  >
                    出力ファイル名
                  </label>
                  <div
                    className="flex items-center rounded-xl overflow-hidden"
                    style={{ backgroundColor: "#262626", border: "1px solid #3a3a3a" }}
                  >
                    <input
                      type="text"
                      value={outputBaseName}
                      onChange={(e) => setOutputBaseName(e.target.value)}
                      disabled={state.isProcessing}
                      className="flex-1 min-w-0 bg-transparent px-4 py-3 text-white text-sm outline-none"
                      style={{ fontFamily: '"Inter", sans-serif', color: "#ffffff" }}
                      placeholder="ファイル名"
                      spellCheck={false}
                      onFocus={(e) => e.target.select()}
                    />
                    <span
                      className="px-3 text-sm shrink-0"
                      style={{ color: "#767575", fontFamily: '"Inter", sans-serif' }}
                    >
                      .{format}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Row 2: action button */}
            <div>
              {!state.result ? (
                <button
                  onClick={handleProcess}
                  disabled={state.isProcessing || !selectedFile}
                  className="w-full px-8 py-5 font-bold text-lg rounded-xl transition-all active:scale-[0.98]"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    background:
                      state.isProcessing || !selectedFile
                        ? "#2c2c2c"
                        : "linear-gradient(to right, #7e51ff, #b6a0ff)",
                    color:
                      state.isProcessing || !selectedFile
                        ? "#767575"
                        : "#340090",
                    boxShadow:
                      state.isProcessing || !selectedFile
                        ? "none"
                        : "0 0 30px rgba(182,160,255,0.3)",
                    cursor:
                      state.isProcessing || !selectedFile
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {state.isProcessing
                    ? "処理中..."
                    : "左右チャンネルを反転する"}
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="w-full px-8 py-5 font-bold text-lg rounded-xl transition-all border"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    borderColor: "#484847",
                    color: "#adaaaa",
                  }}
                >
                  別のファイルを処理する
                </button>
              )}
            </div>

            {/* Progress */}
            {state.isProcessing && (
              <div
                className="mt-6 w-full rounded-full overflow-hidden"
                style={{ backgroundColor: "#262626", height: "4px" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${state.progress}%`,
                    background: "linear-gradient(to right, #7e51ff, #00e3fd)",
                  }}
                />
              </div>
            )}

            {/* Error */}
            {state.error && (
              <div
                className="mt-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                style={{
                  backgroundColor: "rgba(255,110,132,0.1)",
                  color: "#ff6e84",
                  border: "1px solid rgba(255,110,132,0.2)",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "1rem" }}
                >
                  error
                </span>
                {state.error}
              </div>
            )}
          </div>

          {/* Privacy badge */}
          <div
            className="flex items-center justify-center gap-3 py-4 rounded-full"
            style={{ backgroundColor: "#131313" }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                color: "#00e3fd",
                fontSize: "1.1rem",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              lock
            </span>
            <span
              className="text-sm uppercase tracking-widest"
              style={{ color: "#adaaaa", fontFamily: '"Inter", sans-serif' }}
            >
              プライバシー安全: 処理はすべてあなたのブラウザ内で行われます
            </span>
          </div>
        </div>

        {/* Results */}
        {state.result && (
          <section className="max-w-4xl mx-auto px-6 mb-24">
            <div
              className="rounded-2xl p-10 relative overflow-hidden"
              style={{ backgroundColor: "#20201f" }}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontSize: "9rem" }}
                >
                  equalizer
                </span>
              </div>

              <h2
                className="text-3xl text-white mb-12"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                }}
              >
                プレビュー &amp; 書き出し
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <AudioPlayer
                  label="元データ (Original)"
                  url={state.originalUrl}
                  accent="primary"
                />
                <AudioPlayer
                  label="反転後 (Reversed)"
                  url={state.result.url}
                  accent="secondary"
                  badge="READY"
                />
              </div>

              <div
                className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-10"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "rgba(0,227,253,0.1)" }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color: "#00e3fd",
                        fontSize: "1.5rem",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      check_circle
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-bold">
                      反転処理が完了しました
                    </p>
                    <p className="text-xs" style={{ color: "#adaaaa" }}>
                      出力形式: {state.result.format.toUpperCase()} —{" "}
                      {state.result.filename}
                    </p>
                  </div>
                </div>
                <DownloadButton
                  url={state.result.url}
                  filename={state.result.filename}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#0e0e0e",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
        className="py-12 mt-auto"
      >
        <div className="max-w-4xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p
            className="text-xs uppercase tracking-widest text-center md:text-left"
            style={{ color: "#484847", fontFamily: '"Inter", sans-serif' }}
          >
            © 2025 Audio Channel Reverser. MIT License. Processed entirely
            in-browser.
          </p>
          <div className="flex gap-8">
            <a
              href="#"
              className="text-xs uppercase tracking-widest transition-colors"
              style={{ color: "#484847", fontFamily: '"Inter", sans-serif' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#484847")}
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-xs uppercase tracking-widest transition-colors"
              style={{ color: "#484847", fontFamily: '"Inter", sans-serif' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#484847")}
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
