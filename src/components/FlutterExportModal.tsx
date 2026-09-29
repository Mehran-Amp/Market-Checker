import React, { useState } from 'react';
import { FLUTTER_CODEBASE, FlutterFileItem } from '../services/flutterExport/flutterFiles';
import { AppSettings } from '../types/crypto';
import { getTranslation } from '../utils/i18n';
import { X, Copy, Check, Download, Code2, Layers, Cpu, Database, Smartphone } from 'lucide-react';

interface FlutterExportModalProps {
  isOpen: boolean;
  settings: AppSettings;
  onClose: () => void;
}

export const FlutterExportModal: React.FC<FlutterExportModalProps> = ({
  isOpen,
  settings,
  onClose
}) => {
  if (!isOpen) return null;

  const t = getTranslation(settings.language);
  const [selectedFile, setSelectedFile] = useState<FlutterFileItem>(FLUTTER_CODEBASE[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Adapter':
        return <Layers className="w-3.5 h-3.5 text-blue-400" />;
      case 'Engine':
        return <Cpu className="w-3.5 h-3.5 text-amber-400" />;
      case 'Service':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Database':
        return <Database className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Code2 className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 flex flex-col h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{t.exportFlutter}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono">
                  Dart / Hive / Services
                </span>
              </h2>
              <p className="text-xs text-slate-400">{t.flutterDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split View */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 mt-4 min-h-0 overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col overflow-y-auto shrink-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
              Project Structure
            </div>
            <div className="space-y-1">
              {FLUTTER_CODEBASE.map((file) => {
                const isSelected = selectedFile.filename === file.filename;
                return (
                  <button
                    key={file.filename}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-mono transition-all text-left rtl:text-right ${
                      isSelected
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getCategoryIcon(file.category)}
                      <span className="truncate">{file.filename}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden min-h-0">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between p-3 bg-slate-900/90 border-b border-slate-800">
              <div>
                <div className="text-xs font-mono font-bold text-white">
                  {selectedFile.path}
                </div>
                <div className="text-[11px] text-slate-400">
                  {selectedFile.description}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t.copied : t.copyCode}</span>
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.downloadZip}</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <pre className="flex-1 p-4 overflow-auto text-xs font-mono text-emerald-400/90 bg-slate-950 leading-relaxed select-text">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
