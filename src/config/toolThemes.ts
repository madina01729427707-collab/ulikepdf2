export interface ToolTheme {
  iconBg: string;
  iconText: string;
  iconHoverBg: string;
  iconHoverText: string;
  borderColor: string;
  hoverBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentGlow: string;
}

export function getToolTheme(toolId: string, category: string): ToolTheme {
  switch (toolId) {
    case 'merge-pdf':
      return {
        iconBg: 'bg-red-500/15 dark:bg-red-950/60',
        iconText: 'text-red-600 dark:text-red-400',
        iconHoverBg: 'group-hover:bg-red-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-red-200/60 dark:border-red-900/40',
        hoverBorder: 'hover:border-red-500',
        badgeBg: 'bg-red-50 dark:bg-red-950/80',
        badgeText: 'text-red-700 dark:text-red-300',
        badgeBorder: 'border-red-300/60 dark:border-red-800/60',
        accentGlow: 'rgba(239, 68, 68, 0.25)',
      };
    case 'split-pdf':
    case 'split-by-bookmarks':
    case 'split-in-half':
      return {
        iconBg: 'bg-amber-500/15 dark:bg-amber-950/60',
        iconText: 'text-amber-600 dark:text-amber-400',
        iconHoverBg: 'group-hover:bg-amber-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-amber-200/60 dark:border-amber-900/40',
        hoverBorder: 'hover:border-amber-500',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/80',
        badgeText: 'text-amber-700 dark:text-amber-300',
        badgeBorder: 'border-amber-300/60 dark:border-amber-800/60',
        accentGlow: 'rgba(245, 158, 11, 0.25)',
      };
    case 'compress-pdf':
      return {
        iconBg: 'bg-emerald-500/15 dark:bg-emerald-950/60',
        iconText: 'text-emerald-600 dark:text-emerald-400',
        iconHoverBg: 'group-hover:bg-emerald-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-emerald-200/60 dark:border-emerald-900/40',
        hoverBorder: 'hover:border-emerald-500',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/80',
        badgeText: 'text-emerald-700 dark:text-emerald-300',
        badgeBorder: 'border-emerald-300/60 dark:border-emerald-800/60',
        accentGlow: 'rgba(16, 185, 129, 0.25)',
      };
    case 'pdf-to-word':
    case 'word-to-pdf':
      return {
        iconBg: 'bg-blue-600/15 dark:bg-blue-950/60',
        iconText: 'text-blue-600 dark:text-blue-400',
        iconHoverBg: 'group-hover:bg-blue-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-blue-200/60 dark:border-blue-900/40',
        hoverBorder: 'hover:border-blue-500',
        badgeBg: 'bg-blue-50 dark:bg-blue-950/80',
        badgeText: 'text-blue-700 dark:text-blue-300',
        badgeBorder: 'border-blue-300/60 dark:border-blue-800/60',
        accentGlow: 'rgba(37, 99, 235, 0.25)',
      };
    case 'pdf-to-excel':
    case 'excel-to-pdf':
      return {
        iconBg: 'bg-teal-500/15 dark:bg-teal-950/60',
        iconText: 'text-teal-600 dark:text-teal-400',
        iconHoverBg: 'group-hover:bg-teal-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-teal-200/60 dark:border-teal-900/40',
        hoverBorder: 'hover:border-teal-500',
        badgeBg: 'bg-teal-50 dark:bg-teal-950/80',
        badgeText: 'text-teal-700 dark:text-teal-300',
        badgeBorder: 'border-teal-300/60 dark:border-teal-800/60',
        accentGlow: 'rgba(20, 184, 166, 0.25)',
      };
    case 'pdf-to-powerpoint':
    case 'powerpoint-to-pdf':
      return {
        iconBg: 'bg-orange-500/15 dark:bg-orange-950/60',
        iconText: 'text-orange-600 dark:text-orange-400',
        iconHoverBg: 'group-hover:bg-orange-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-orange-200/60 dark:border-orange-900/40',
        hoverBorder: 'hover:border-orange-500',
        badgeBg: 'bg-orange-50 dark:bg-orange-950/80',
        badgeText: 'text-orange-700 dark:text-orange-300',
        badgeBorder: 'border-orange-300/60 dark:border-orange-800/60',
        accentGlow: 'rgba(249, 115, 22, 0.25)',
      };
    case 'pdf-to-jpg':
    case 'jpg-to-pdf':
    case 'images-to-pdf':
    case 'extract-images-pdf':
      return {
        iconBg: 'bg-fuchsia-500/15 dark:bg-fuchsia-950/60',
        iconText: 'text-fuchsia-600 dark:text-fuchsia-400',
        iconHoverBg: 'group-hover:bg-fuchsia-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-fuchsia-200/60 dark:border-fuchsia-900/40',
        hoverBorder: 'hover:border-fuchsia-500',
        badgeBg: 'bg-fuchsia-50 dark:bg-fuchsia-950/80',
        badgeText: 'text-fuchsia-700 dark:text-fuchsia-300',
        badgeBorder: 'border-fuchsia-300/60 dark:border-fuchsia-800/60',
        accentGlow: 'rgba(217, 70, 239, 0.25)',
      };
    case 'rotate-pdf':
    case 'organize-pdf':
    case 'reorder-pdf-pages':
    case 'sort-pdf':
    case 'n-up-pdf':
      return {
        iconBg: 'bg-violet-500/15 dark:bg-violet-950/60',
        iconText: 'text-violet-600 dark:text-violet-400',
        iconHoverBg: 'group-hover:bg-violet-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-violet-200/60 dark:border-violet-900/40',
        hoverBorder: 'hover:border-violet-500',
        badgeBg: 'bg-violet-50 dark:bg-violet-950/80',
        badgeText: 'text-violet-700 dark:text-violet-300',
        badgeBorder: 'border-violet-300/60 dark:border-violet-800/60',
        accentGlow: 'rgba(139, 92, 246, 0.25)',
      };
    case 'page-numbers-pdf':
    case 'bates-numbering-pdf':
    case 'header-footer-pdf':
    case 'resize-pdf':
      return {
        iconBg: 'bg-cyan-500/15 dark:bg-cyan-950/60',
        iconText: 'text-cyan-600 dark:text-cyan-400',
        iconHoverBg: 'group-hover:bg-cyan-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-cyan-200/60 dark:border-cyan-900/40',
        hoverBorder: 'hover:border-cyan-500',
        badgeBg: 'bg-cyan-50 dark:bg-cyan-950/80',
        badgeText: 'text-cyan-700 dark:text-cyan-300',
        badgeBorder: 'border-cyan-300/60 dark:border-cyan-800/60',
        accentGlow: 'rgba(6, 182, 212, 0.25)',
      };
    case 'edit-pdf':
    case 'visual-pdf-editor':
      return {
        iconBg: 'bg-indigo-500/15 dark:bg-indigo-950/60',
        iconText: 'text-indigo-600 dark:text-indigo-400',
        iconHoverBg: 'group-hover:bg-indigo-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-indigo-200/60 dark:border-indigo-900/40',
        hoverBorder: 'hover:border-indigo-500',
        badgeBg: 'bg-indigo-50 dark:bg-indigo-950/80',
        badgeText: 'text-indigo-700 dark:text-indigo-300',
        badgeBorder: 'border-indigo-300/60 dark:border-indigo-800/60',
        accentGlow: 'rgba(99, 102, 241, 0.25)',
      };
    case 'sign-pdf':
      return {
        iconBg: 'bg-rose-500/15 dark:bg-rose-950/60',
        iconText: 'text-rose-600 dark:text-rose-400',
        iconHoverBg: 'group-hover:bg-rose-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-rose-200/60 dark:border-rose-900/40',
        hoverBorder: 'hover:border-rose-500',
        badgeBg: 'bg-rose-50 dark:bg-rose-950/80',
        badgeText: 'text-rose-700 dark:text-rose-300',
        badgeBorder: 'border-rose-300/60 dark:border-rose-800/60',
        accentGlow: 'rgba(244, 63, 94, 0.25)',
      };
    case 'protect-pdf':
    case 'unlock-pdf':
    case 'flatten-pdf':
      return {
        iconBg: 'bg-amber-500/15 dark:bg-amber-950/60',
        iconText: 'text-amber-600 dark:text-amber-400',
        iconHoverBg: 'group-hover:bg-amber-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-amber-200/60 dark:border-amber-900/40',
        hoverBorder: 'hover:border-amber-500',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/80',
        badgeText: 'text-amber-700 dark:text-amber-300',
        badgeBorder: 'border-amber-300/60 dark:border-amber-800/60',
        accentGlow: 'rgba(245, 158, 11, 0.25)',
      };
    case 'redact-pdf':
    case 'delete-pdf-pages':
      return {
        iconBg: 'bg-red-600/15 dark:bg-red-950/60',
        iconText: 'text-red-600 dark:text-red-400',
        iconHoverBg: 'group-hover:bg-red-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-red-200/60 dark:border-red-900/40',
        hoverBorder: 'hover:border-red-500',
        badgeBg: 'bg-red-50 dark:bg-red-950/80',
        badgeText: 'text-red-700 dark:text-red-300',
        badgeBorder: 'border-red-300/60 dark:border-red-800/60',
        accentGlow: 'rgba(220, 38, 38, 0.25)',
      };
    case 'ocr-pdf':
    case 'deskew-pdf':
      return {
        iconBg: 'bg-green-500/15 dark:bg-green-950/60',
        iconText: 'text-green-600 dark:text-green-400',
        iconHoverBg: 'group-hover:bg-green-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-green-200/60 dark:border-green-900/40',
        hoverBorder: 'hover:border-green-500',
        badgeBg: 'bg-green-50 dark:bg-green-950/80',
        badgeText: 'text-green-700 dark:text-green-300',
        badgeBorder: 'border-green-300/60 dark:border-green-800/60',
        accentGlow: 'rgba(34, 197, 94, 0.25)',
      };
    case 'repair-pdf':
      return {
        iconBg: 'bg-pink-500/15 dark:bg-pink-950/60',
        iconText: 'text-pink-600 dark:text-pink-400',
        iconHoverBg: 'group-hover:bg-pink-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-pink-200/60 dark:border-pink-900/40',
        hoverBorder: 'hover:border-pink-500',
        badgeBg: 'bg-pink-50 dark:bg-pink-950/80',
        badgeText: 'text-pink-700 dark:text-pink-300',
        badgeBorder: 'border-pink-300/60 dark:border-pink-800/60',
        accentGlow: 'rgba(236, 72, 153, 0.25)',
      };
    default:
      if (category === 'organize') {
        return {
          iconBg: 'bg-amber-500/15 dark:bg-amber-950/60',
          iconText: 'text-amber-600 dark:text-amber-400',
          iconHoverBg: 'group-hover:bg-amber-600',
          iconHoverText: 'group-hover:text-white',
          borderColor: 'border-amber-200/60 dark:border-amber-900/40',
          hoverBorder: 'hover:border-amber-500',
          badgeBg: 'bg-amber-50 dark:bg-amber-950/80',
          badgeText: 'text-amber-700 dark:text-amber-300',
          badgeBorder: 'border-amber-300/60 dark:border-amber-800/60',
          accentGlow: 'rgba(245, 158, 11, 0.25)',
        };
      }
      if (category === 'optimize') {
        return {
          iconBg: 'bg-emerald-500/15 dark:bg-emerald-950/60',
          iconText: 'text-emerald-600 dark:text-emerald-400',
          iconHoverBg: 'group-hover:bg-emerald-600',
          iconHoverText: 'group-hover:text-white',
          borderColor: 'border-emerald-200/60 dark:border-emerald-900/40',
          hoverBorder: 'hover:border-emerald-500',
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/80',
          badgeText: 'text-emerald-700 dark:text-emerald-300',
          badgeBorder: 'border-emerald-300/60 dark:border-emerald-800/60',
          accentGlow: 'rgba(16, 185, 129, 0.25)',
        };
      }
      return {
        iconBg: 'bg-purple-500/15 dark:bg-purple-950/60',
        iconText: 'text-purple-600 dark:text-purple-400',
        iconHoverBg: 'group-hover:bg-purple-600',
        iconHoverText: 'group-hover:text-white',
        borderColor: 'border-purple-200/60 dark:border-purple-900/40',
        hoverBorder: 'hover:border-purple-500',
        badgeBg: 'bg-purple-50 dark:bg-purple-950/80',
        badgeText: 'text-purple-700 dark:text-purple-300',
        badgeBorder: 'border-purple-300/60 dark:border-purple-800/60',
        accentGlow: 'rgba(168, 85, 247, 0.25)',
      };
  }
}
