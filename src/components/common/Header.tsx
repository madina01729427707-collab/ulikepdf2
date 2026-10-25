import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BRAND } from '../../config/brand';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageModal } from './LanguageModal';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Layers,
  Globe
} from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, currentLanguageOption } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: t('nav.all_tools', 'All PDF Tools'), path: '/tools' },
    { label: t('nav.merge', 'Merge PDF'), path: '/merge-pdf' },
    { label: t('nav.split', 'Split PDF'), path: '/split-pdf' },
    { label: t('nav.compress', 'Compress PDF'), path: '/compress-pdf' },
    { label: t('nav.pdf_to_jpg', 'PDF to JPG'), path: '/pdf-to-jpg' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Brand Wordmark with User's Official Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center p-0.5 transition-transform group-hover:scale-105">
              <img 
                src="/logo.png" 
                alt="uLikePDF Logo" 
                className="w-full h-full object-contain drop-shadow-md" 
              />
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">
              {BRAND.prefix}<span className="text-blue-600 dark:text-blue-500">{BRAND.suffix}</span>
            </span>
          </Link>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Language Selector, Theme Toggle, CTA, Mobile Menu) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Global Language Selector (25 Languages) */}
            <button
              onClick={() => setLangModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700/90 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-blue-400 shadow-xs"
              title={t('nav.select_language', 'Select Language (25 Languages)')}
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-sm shrink-0">{currentLanguageOption.flag}</span>
              <span className="hidden sm:inline font-medium text-xs max-w-[90px] truncate">{currentLanguageOption.nativeName}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={theme === 'dark' ? t('nav.theme_light', 'Switch to light mode') : t('nav.theme_dark', 'Switch to dark mode')}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Primary CTA (Tools Directory) */}
            <Link
              to="/tools"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-sm transition-all whitespace-nowrap hover:shadow-md hover:scale-[1.02]"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('nav.popular_badge', 'All Tools')}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLangModalOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 rounded-lg w-full justify-center"
              >
                <Globe className="w-4 h-4" />
                <span>Language: {currentLanguageOption.flag} {currentLanguageOption.nativeName} ({currentLanguageOption.fontName})</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Language Selection Modal */}
      <LanguageModal isOpen={langModalOpen} onClose={() => setLangModalOpen(false)} />
    </>
  );
};

