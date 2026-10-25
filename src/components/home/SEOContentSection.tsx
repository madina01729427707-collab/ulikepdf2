import React from 'react';
import { ShieldCheck, Zap, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const SEOContentSection: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <section className="py-16 border-t border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading with Target Keywords */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? '১০০% ফ্রি ও নিরাপদ' : '100% Free & Private'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isBn 
              ? 'uLikePDF – সেরা ফ্রি অনলাইন PDF টুলস ও iLovePDF বিকল্প'
              : 'uLikePDF – The Best Free Online PDF Tools & iLovePDF Alternative'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {isBn
              ? 'uLikePDF হলো একটি আধুনিক, দ্রুত এবং সম্পূর্ণ নিরাপদ ওয়েব প্ল্যাটফর্ম। ফাইল কোনো রিমোট সার্ভারে আপলোড না করে সরাসরি আপনার ব্রাউজারে পিডিএফ মার্জ, স্প্লিট, কম্প্রেস, কনভার্ট এবং এডিট করুন।'
              : 'uLikePDF offers lightning-fast, 100% private in-browser document processing. Merge, compress, convert, organize, and edit PDF documents without uploading your sensitive files to cloud servers.'}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isBn ? '১০০% ক্লায়েন্ট-সাইড প্রাইভেসি' : '100% In-Browser Privacy'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn
                ? 'সাধারণ ক্লাউড টুলসের (যেমন iLovePDF বা Smallpdf) মতো আপনার ব্যক্তিগত বা অফিশিয়াল ফাইল কোনো থার্ড পার্টি সার্ভারে আপলোড হয় না।'
                : 'Unlike traditional cloud converters like iLovePDF or Smallpdf, your files never leave your computer. Processing happens locally using WebAssembly.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isBn ? 'কোনো লিমিট বা ওয়াটারমার্ক নেই' : 'No File Size Limits or Watermarks'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn
                ? 'কোনো সাবস্ক্রিপশন ফি বা লুকানো চার্জ ছাড়া আনলিমিটেড পিডিএফ পেজ মার্জ, স্প্লিট, কম্প্রেস এবং কনভার্ট করুন সম্পূর্ণ ফ্রিতে।'
                : 'Enjoy unlimited PDF merging, smart compression, conversion, and organization without annoying paywalls, page limits, or forced watermarks.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isBn ? 'ক্লাউড ইন্টিগ্রেশন ও ড্র্যাগ-ড্রপ' : 'Cloud Drive & Drag-Drop Sync'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn
                ? 'Google Drive এবং Dropbox থেকে সরাসরি ফাইল আনুন এবং ড্র্যাগ অ্যান্ড ড্রপ করে পেজগুলো খুব সহজেই নিজের মতো সাজিয়ে নিন।'
                : 'Directly import files from Google Drive and Dropbox, then drag-and-drop to reorder, rotate, delete, or zoom into pages with ease.'}
            </p>
          </div>
        </div>

        {/* Comparison / Semantic SEO Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {isBn 
              ? 'uLikePDF বনাম অন্যান্য সাধারণ PDF টুলস (যেমন: iLovePDF)' 
              : 'uLikePDF vs Other Online PDF Services (e.g. iLovePDF)'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3 p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
              <div className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>uLikePDF (ulikepdf.com)</span>
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• {isBn ? 'ফাইল ১০০% ইউজারের ব্রাউজারে প্রসেস হয় (কোনো সার্ভার আপলোড নেই)' : 'Files process 100% locally in your browser (Zero server uploads)'}</li>
                <li>• {isBn ? 'সম্পূর্ণ বিনামূল্যে সব ফিচার ব্যবহারযোগ্য' : 'Completely free for all features with no forced signups'}</li>
                <li>• {isBn ? 'লাইভ প্রিভিউ ও জুম সহ পেজ অর্গানাইজ করার সুবিধা' : 'Visual drag-and-drop page organizer with interactive zoom'}</li>
                <li>• {isBn ? 'গুগল ড্রাইভ ও ড্রপবক্স থেকে সরাসরি ফাইল ইমপোর্ট' : 'Direct cloud import from Google Drive & Dropbox'}</li>
              </ul>
            </div>
            <div className="space-y-3 p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-slate-700 dark:text-slate-300">
                {isBn ? 'সাধারণ অনলাইন পিডিএফ সাইট (যেমন iLovePDF)' : 'Standard Cloud PDF Sites (e.g. iLovePDF)'}
              </div>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li>• {isBn ? 'ফাইল রিমোট সার্ভারে আপলোড করতে হয়' : 'Requires uploading documents to remote cloud storage'}</li>
                <li>• {isBn ? 'ফাইল সাইজ ও ব্যবহারের ওপর নির্দিষ্ট লিমিটেশন থাকে' : 'Strict hourly limits or paywalls on file sizes'}</li>
                <li>• {isBn ? 'প্রিমিয়াম ফিচারের জন্য মাসিক সাবস্ক্রিপশন চায়' : 'Requires paid plans or subscriptions for advanced tools'}</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
