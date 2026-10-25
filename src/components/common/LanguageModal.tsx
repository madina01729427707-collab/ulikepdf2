import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguage } from '../../i18n/translations';
import { X, Search, Check, Globe } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, languages, t } = useLanguage();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = languages.filter((l) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.fontName.toLowerCase().includes(q)
    );
  });

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-blue-200/50 dark:border-blue-900/40 gemini-card overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('nav.select_language', 'Select Language / ভাষা নির্বাচন করুন')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                25 Languages with dedicated native typography & instant site conversion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close language modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Filter */}
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search language or font (e.g. বাংলা, Roboto, Español, العربية, Inter)..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filtered.map((item, idx) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => handleSelect(item.code)}
                style={{ fontFamily: item.fontFamily }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-500/80 text-blue-900 dark:text-blue-100 shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{item.flag}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm tracking-tight truncate">
                        {item.nativeName}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 truncate">
                        ({item.name})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100/70 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                        Font: {item.fontName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        #{idx + 1}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Active Font: <strong>{languages.find(l => l.code === language)?.fontName}</strong></span>
          <button 
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
