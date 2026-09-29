import React, { useState, useEffect } from 'react';
import { AppLanguage, LanguageInfo } from '../types/crypto';
import { SUPPORTED_LANGUAGES, getTranslation } from '../utils/i18n';
import { Globe, Check, ArrowRight, X } from 'lucide-react';

interface LanguageSelectModalProps {
  isOpen: boolean;
  currentLanguage: AppLanguage;
  isFirstLaunch?: boolean;
  onSelectLanguage: (lang: AppLanguage) => void;
  onClose?: () => void;
}

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  currentLanguage,
  isFirstLaunch = false,
  onSelectLanguage,
  onClose
}) => {
  const [selected, setSelected] = useState<AppLanguage>(currentLanguage || 'en');

  useEffect(() => {
    if (currentLanguage) {
      setSelected(currentLanguage);
    }
  }, [currentLanguage, isOpen]);

  if (!isOpen) return null;

  const currentT = getTranslation(selected);

  const handleConfirm = () => {
    onSelectLanguage(selected);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-lg my-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {!isFirstLaunch && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Decorative Top Accent */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 mx-auto mb-4 text-slate-950 shadow-lg shadow-amber-500/20">
          <Globe className="w-7 h-7 stroke-[2.2]" />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {currentT.chooseLanguage}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-sm mx-auto">
            {currentT.chooseLanguageSubtitle}
          </p>
        </div>

        {/* 7 Languages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
          {SUPPORTED_LANGUAGES.map((lang: LanguageInfo) => {
            const isSelected = selected === lang.code;
            const isRTL = lang.dir === 'rtl';

            return (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                  isRTL ? 'text-right' : 'text-left'
                } ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{lang.nativeName}</span>
                      {lang.code === 'en' && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {lang.name}
                    </div>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isSelected ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-700'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>{currentT.confirmLanguage}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180 stroke-[3]" />
        </button>

        {/* Small subtext */}
        <div className="text-center mt-4 text-[11px] text-slate-500">
          You can change your language anytime from Settings or the top bar.
        </div>
      </div>
    </div>
  );
};
