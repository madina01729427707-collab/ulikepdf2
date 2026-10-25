import React, { useState, useRef } from 'react';
import { 
  X, 
  Search, 
  Check, 
  FileText, 
  ArrowRight, 
  Link as LinkIcon, 
  RefreshCw, 
  UserPlus, 
  ChevronDown, 
  Upload, 
  ArrowLeft,
  Shield,
  HardDrive
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export type CloudProvider = 'google-drive' | 'dropbox';

interface CloudFile {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  modified: string;
  path: string;
  rawFile?: File;
}

interface CloudStorageModalProps {
  isOpen: boolean;
  provider: CloudProvider;
  onClose: () => void;
  onFileSelected: (file: File) => void;
}

interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initial: string;
  bgColor: string;
  isRedRing?: boolean;
}

const DEFAULT_GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    id: 'g-1',
    name: 'MD ASHIKUR RAHAMAN',
    email: 'ashik017294@gmail.com',
    avatarUrl: '/assets/avatar_ashikur.png',
    initial: 'M',
    bgColor: 'bg-amber-600',
  },
  {
    id: 'g-2',
    name: 'Amanda Johnson',
    email: 'amanda27707@gmail.com',
    avatarUrl: '/assets/avatar_amanda.png',
    initial: 'A',
    bgColor: 'bg-emerald-600',
  },
  {
    id: 'g-3',
    name: 'Madinatul Ulum Mohila Madrasha',
    email: 'madina01729427707@gmail.com',
    avatarUrl: '/assets/avatar_madina.png',
    initial: 'M',
    bgColor: 'bg-teal-700',
  },
  {
    id: 'g-4',
    name: 'Ashikur Rahman',
    email: 'ashik1821@gmail.com',
    avatarUrl: '/assets/avatar_ashikur2.png',
    initial: 'A',
    bgColor: 'bg-slate-700',
    isRedRing: true,
  },
];

export const CloudStorageModal: React.FC<CloudStorageModalProps> = ({
  isOpen,
  provider,
  onClose,
  onFileSelected,
}) => {
  // Steps: 'auth' | 'custom-email' | 'browser'
  const [step, setStep] = useState<'auth' | 'custom-email' | 'browser'>('auth');
  const [activeAccount, setActiveAccount] = useState<{ name: string; email: string }>({
    name: 'MD ASHIKUR RAHAMAN',
    email: 'ashik017294@gmail.com',
  });
  const [customInputEmail, setCustomInputEmail] = useState('');
  const [dropboxInputEmail, setDropboxInputEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string | null>('doc-1');
  const [directLink, setDirectLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<CloudFile[]>([]);
  const localUploadInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isGoogle = provider === 'google-drive';

  // Preset cloud documents for Google Drive & Dropbox
  const baseGoogleFiles: CloudFile[] = [
    {
      id: 'doc-1',
      name: 'Business_Contract_Agreement_2026.pdf',
      size: '2.4 MB',
      sizeBytes: 2450000,
      modified: 'Today, 2:15 PM',
      path: 'My Drive / Contracts',
    },
    {
      id: 'doc-2',
      name: 'Financial_Quarterly_Report_Q3.pdf',
      size: '1.8 MB',
      sizeBytes: 1840000,
      modified: 'Yesterday, 11:30 AM',
      path: 'My Drive / Financial Reports',
    },
    {
      id: 'doc-3',
      name: 'Company_Product_Catalog_Final.pdf',
      size: '4.2 MB',
      sizeBytes: 4200000,
      modified: 'Oct 22, 2026',
      path: 'My Drive / Marketing',
    },
    {
      id: 'doc-4',
      name: 'Tax_Exemption_Certificate_Signed.pdf',
      size: '720 KB',
      sizeBytes: 737280,
      modified: 'Oct 19, 2026',
      path: 'Shared with me / Legal',
    },
    {
      id: 'doc-5',
      name: 'Project_Architecture_Blueprint.pdf',
      size: '3.1 MB',
      sizeBytes: 3100000,
      modified: 'Oct 14, 2026',
      path: 'My Drive / Engineering',
    },
  ];

  const baseDropboxFiles: CloudFile[] = [
    {
      id: 'db-1',
      name: 'Dropbox_Client_Portfolio_2026.pdf',
      size: '3.1 MB',
      sizeBytes: 3100000,
      modified: '10 mins ago',
      path: 'Dropbox / Work / Portfolios',
    },
    {
      id: 'db-2',
      name: 'Vendor_Compliance_Tax_Form.pdf',
      size: '650 KB',
      sizeBytes: 665600,
      modified: '2 days ago',
      path: 'Dropbox / Taxes / 2026',
    },
    {
      id: 'db-3',
      name: 'Real_Estate_Purchase_Closing_Deed.pdf',
      size: '4.5 MB',
      sizeBytes: 4500000,
      modified: 'Oct 18, 2026',
      path: 'Dropbox / Personal / Property',
    },
    {
      id: 'db-4',
      name: 'Quarterly_Research_Summary.pdf',
      size: '1.8 MB',
      sizeBytes: 1840000,
      modified: 'Oct 12, 2026',
      path: 'Dropbox / Research',
    },
  ];

  const allFiles = [...uploadedFiles, ...(isGoogle ? baseGoogleFiles : baseDropboxFiles)];
  const filteredFiles = allFiles.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to generate a valid PDF if simulated
  const createValidPdfBlob = async (fileItem: CloudFile): Promise<File> => {
    if (fileItem.rawFile) {
      return fileItem.rawFile;
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Header strip
    page.drawRectangle({
      x: 40,
      y: 730,
      width: 515,
      height: 70,
      color: isGoogle ? rgb(0.24, 0.51, 0.96) : rgb(0.0, 0.38, 0.99),
    });

    page.drawText(isGoogle ? 'Google Drive Document' : 'Dropbox Document', {
      x: 60,
      y: 760,
      size: 20,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText(`uLikePDF Secure Cloud Sync · ${activeAccount.email}`, {
      x: 60,
      y: 742,
      size: 11,
      font: fontRegular,
      color: rgb(0.9, 0.95, 1),
    });

    // Content body
    page.drawText(`Document Title: ${fileItem.name}`, {
      x: 60,
      y: 680,
      size: 14,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    page.drawText(`Storage Path: ${fileItem.path}`, {
      x: 60,
      y: 655,
      size: 11,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText(`Account Owner: ${activeAccount.name} (${activeAccount.email})`, {
      x: 60,
      y: 635,
      size: 11,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText(`Imported On: ${new Date().toLocaleString()}`, {
      x: 60,
      y: 615,
      size: 11,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText('This document has been safely imported from your cloud storage into uLikePDF.', {
      x: 60,
      y: 560,
      size: 12,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText('All pages and structures are ready for merge, split, compress, or conversion operations.', {
      x: 60,
      y: 540,
      size: 11,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes).buffer as ArrayBuffer], { type: 'application/pdf' });
    return new File([blob], fileItem.name, { type: 'application/pdf', lastModified: Date.now() });
  };

  const handleSelectAccount = (acc: GoogleAccount) => {
    setActiveAccount({ name: acc.name, email: acc.email });
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('browser');
    }, 400);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputEmail.trim()) return;
    const email = customInputEmail.trim();
    const name = email.split('@')[0].toUpperCase();
    setActiveAccount({ name, email });
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('browser');
    }, 400);
  };

  const handleDropboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = dropboxInputEmail.trim() || 'ashik017294@gmail.com';
    const name = email.split('@')[0].toUpperCase();
    setActiveAccount({ name, email });
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('browser');
    }, 450);
  };

  const handleDropboxSSO = (providerName: string) => {
    const email = providerName === 'Google' ? 'ashik017294@gmail.com' : `user@${providerName.toLowerCase()}.com`;
    setActiveAccount({ name: `MD ASHIKUR RAHAMAN (${providerName})`, email });
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('browser');
    }, 400);
  };

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const newCloudItem: CloudFile = {
      id: `local-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      sizeBytes: file.size,
      modified: 'Just now',
      path: isGoogle ? `My Drive / Uploads / ${file.name}` : `Dropbox / Uploads / ${file.name}`,
      rawFile: file,
    };
    setUploadedFiles([newCloudItem, ...uploadedFiles]);
    setSelectedFileId(newCloudItem.id);
  };

  const handleImportSelected = async () => {
    const target = allFiles.find((f) => f.id === selectedFileId) || allFiles[0];
    if (!target) return;

    try {
      setIsProcessing(true);
      const file = await createValidPdfBlob(target);
      setIsProcessing(false);
      onFileSelected(file);
      onClose();
    } catch {
      setIsProcessing(false);
    }
  };

  const handleImportFromLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directLink.trim()) return;

    try {
      setIsProcessing(true);
      const parsedName = directLink.split('/').pop()?.replace(/[^a-zA-Z0-9._-]/g, '') || 'Cloud_Imported_Document.pdf';
      const finalName = parsedName.endsWith('.pdf') ? parsedName : `${parsedName}.pdf`;

      const mockItem: CloudFile = {
        id: `link-${Date.now()}`,
        name: finalName,
        size: '1.6 MB',
        sizeBytes: 1600000,
        modified: 'Just now',
        path: directLink,
      };

      const file = await createValidPdfBlob(mockItem);
      setIsProcessing(false);
      onFileSelected(file);
      onClose();
    } catch {
      setIsProcessing(false);
    }
  };

  // =========================================================================
  // VIEW 1: GOOGLE SIGN-IN ACCOUNT PICKER (Matching image_57f28363.png)
  // =========================================================================
  if (isGoogle && step === 'auth') {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={onClose}
      >
        <div 
          className="w-full max-w-[420px] bg-[#131314] text-[#e8eaed] rounded-3xl border border-[#3c4043]/70 shadow-2xl p-6 sm:p-7 flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar: Google G logo + Sign in with Google + Close */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2.5">
              {/* Google 4-Color G logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-sm font-medium text-[#e8eaed]">Sign in with Google</span>
            </div>
            <button
              onClick={onClose}
              className="text-[#9aa0a6] hover:text-white p-1 rounded-full hover:bg-[#3c4043]/50 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* App Brand Badge: White square containing app logo */}
          <div className="pt-2">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm">
              <img src="/logo.png" alt="uLikePDF Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Heading */}
          <div className="pt-4 pb-2">
            <h2 className="text-2xl font-normal text-white">Choose an account</h2>
            <p className="text-sm text-[#8ab4f8] mt-0.5">
              to continue to <strong className="text-white font-medium">uLikePDF</strong>
            </p>
          </div>

          {/* Account List matching screenshot */}
          <div className="mt-3 divide-y divide-[#3c4043]/70">
            {DEFAULT_GOOGLE_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleSelectAccount(acc)}
                className="w-full py-3 px-2 flex items-center gap-3.5 hover:bg-[#282a2d] rounded-xl transition-colors text-left cursor-pointer group"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {acc.avatarUrl ? (
                    <img
                      src={acc.avatarUrl}
                      alt={acc.name}
                      className={`w-9 h-9 rounded-full object-cover border ${
                        acc.isRedRing ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#3c4043]'
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-9 h-9 rounded-full ${acc.bgColor} text-white font-medium text-sm flex items-center justify-center`}
                    >
                      {acc.initial}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-white truncate group-hover:text-[#8ab4f8] transition-colors">
                    {acc.name}
                  </div>
                  <div className="text-[12px] text-[#9aa0a6] truncate">{acc.email}</div>
                </div>
              </button>
            ))}

            {/* "Use another account" button */}
            <button
              type="button"
              onClick={() => setStep('custom-email')}
              className="w-full py-3 px-2 flex items-center gap-3.5 hover:bg-[#282a2d] rounded-xl transition-colors text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full border border-[#5f6368] flex items-center justify-center text-[#9aa0a6] group-hover:text-white group-hover:border-white transition-colors shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="text-[13px] font-medium text-white group-hover:text-[#8ab4f8] transition-colors">
                Use another account
              </div>
            </button>
          </div>

          {/* Privacy & Terms disclaimer text */}
          <div className="pt-6 pb-2 text-[12px] text-[#9aa0a6] leading-relaxed">
            Before using this app, you can review uLikePDF’s{' '}
            <span className="text-[#8ab4f8] hover:underline cursor-pointer">Privacy Policy</span> and{' '}
            <span className="text-[#8ab4f8] hover:underline cursor-pointer">Terms of Service</span>.
          </div>

          {/* Footer outside or bottom */}
          <div className="pt-4 mt-2 border-t border-[#3c4043]/50 flex items-center justify-between text-[11px] text-[#9aa0a6]">
            <div className="flex items-center gap-1 hover:text-white cursor-pointer">
              <span>English (United States)</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-3">
              <span className="hover:text-white cursor-pointer">Help</span>
              <span className="hover:text-white cursor-pointer">Privacy</span>
              <span className="hover:text-white cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1B: GOOGLE "ENTER ANOTHER ACCOUNT" EMAIL PROMPT
  // =========================================================================
  if (isGoogle && step === 'custom-email') {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={onClose}
      >
        <div 
          className="w-full max-w-[420px] bg-[#131314] text-[#e8eaed] rounded-3xl border border-[#3c4043]/70 shadow-2xl p-6 sm:p-7 flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3">
            <button
              onClick={() => setStep('auth')}
              className="text-[#9aa0a6] hover:text-white flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#9aa0a6] hover:text-white p-1 rounded-full hover:bg-[#3c4043]/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Logo badge */}
          <div className="pt-2">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm">
              <img src="/logo.png" alt="uLikePDF Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="pt-4 pb-2">
            <h2 className="text-2xl font-normal text-white">Sign in</h2>
            <p className="text-sm text-[#8ab4f8] mt-0.5">to continue to uLikePDF</p>
          </div>

          <form onSubmit={handleCustomGoogleSubmit} className="pt-4 space-y-5">
            <div>
              <input
                type="email"
                autoFocus
                required
                value={customInputEmail}
                onChange={(e) => setCustomInputEmail(e.target.value)}
                placeholder="Email or phone"
                className="w-full px-4 py-3.5 bg-transparent border border-[#5f6368] focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] rounded-lg text-white text-sm outline-hidden placeholder:text-[#9aa0a6]"
              />
              <button
                type="button"
                className="text-[12px] font-medium text-[#8ab4f8] hover:underline mt-2 inline-block cursor-pointer"
              >
                Forgot email?
              </button>
            </div>

            <div className="text-[12px] text-[#9aa0a6] leading-relaxed">
              Not your computer? Use Guest mode to sign in privately.{' '}
              <span className="text-[#8ab4f8] hover:underline cursor-pointer">Learn more</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('auth')}
                className="text-[13px] font-medium text-[#8ab4f8] hover:underline cursor-pointer"
              >
                Create account
              </button>
              <button
                type="submit"
                disabled={!customInputEmail.trim() || isProcessing}
                className="px-6 py-2.5 bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#041e49] text-xs font-semibold rounded-full transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DROPBOX LOGIN / SIGN UP (Matching image_c59106ae.png)
  // =========================================================================
  if (!isGoogle && step === 'auth') {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={onClose}
      >
        <div 
          className="w-full max-w-[760px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Dropbox Logo + Illustration */}
          <div className="w-full md:w-[45%] bg-white p-6 sm:p-8 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-slate-100">
            {/* Dropbox Brand */}
            <div className="flex items-center gap-2.5 self-start pt-1">
              <svg className="w-7 h-7 text-[#0061FE] fill-current" viewBox="0 0 24 24">
                <path d="M6 2l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zM0 10l6 4-6 4-6-4 6-4zm24 0l-6 4 6 4 6-4-6-4zM6 14.5l6-4 6 4-6 4-6-4z"/>
                <path d="M6 18.5l6 4 6-4-2.5-1.7-3.5 2.3-3.5-2.3L6 18.5z"/>
              </svg>
              <span className="text-xl font-bold tracking-tight text-slate-900">Dropbox</span>
            </div>

            {/* Illustration from User's Screenshot */}
            <div className="my-auto py-6 max-w-[260px]">
              <img
                src="/assets/dropbox_login_art.png"
                alt="Dropbox Illustration"
                className="w-full h-auto object-contain max-h-[300px]"
              />
            </div>

            <div className="text-[11px] text-slate-400 text-center pb-1">
              Securely access and import your Dropbox files to uLikePDF
            </div>
          </div>

          {/* Right Column: Sign in / Sign up form */}
          <div className="w-full md:w-[55%] p-6 sm:p-9 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-6">
              Log in or sign up
            </h2>

            {/* SSO Buttons */}
            <div className="space-y-3">
              {/* Continue with Google */}
              <button
                type="button"
                onClick={() => handleDropboxSSO('Google')}
                className="w-full py-3 px-4 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-medium text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Continue with Apple */}
              <button
                type="button"
                onClick={() => handleDropboxSSO('Apple')}
                className="w-full py-3 px-4 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-medium text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current text-black shrink-0" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.93.04-2.03.62-2.68 1.39-.58.67-1.09 1.76-.95 2.82 1.03.08 2.06-.51 2.69-1.28z"/>
                </svg>
                <span>Continue with Apple</span>
              </button>

              {/* Continue with Microsoft */}
              <button
                type="button"
                onClick={() => handleDropboxSSO('Microsoft')}
                className="w-full py-3 px-4 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-medium text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                <span>Continue with Microsoft</span>
              </button>
            </div>

            {/* "or" Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400">or</span>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleDropboxSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={dropboxInputEmail}
                  onChange={(e) => setDropboxInputEmail(e.target.value)}
                  placeholder="ashik017294@gmail.com"
                  className="w-full px-3.5 py-3 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:border-[#0061FE] focus:ring-1 focus:ring-[#0061FE]"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#0061FE] hover:bg-[#0052D4] text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 text-slate-800 hover:bg-slate-100 font-semibold text-sm rounded-lg transition-colors cursor-pointer text-center block"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: CLOUD FILE MANAGER (Google Drive & Dropbox explorer)
  // =========================================================================
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-blue-200/50 dark:border-blue-900/40 gemini-card overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/40 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20">
          <div className="flex items-center gap-3">
            {isGoogle ? (
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                {/* Google Drive Logo */}
                <svg className="w-6 h-6" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-[#0061FE]/10 text-[#0061FE] flex items-center justify-center shadow-xs">
                {/* Dropbox Logo */}
                <svg className="w-6 h-6 fill-current text-[#0061FE]" viewBox="0 0 24 24">
                  <path d="M6 2l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zM0 10l6 4-6 4-6-4 6-4zm24 0l-6 4 6 4 6-4-6-4zM6 14.5l6-4 6 4-6 4-6-4z"/>
                  <path d="M6 18.5l6 4 6-4-2.5-1.7-3.5 2.3-3.5-2.3L6 18.5z"/>
                </svg>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isGoogle ? 'Google Drive' : 'Dropbox'}
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeAccount.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep('auth')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2.5 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer font-medium"
            >
              Switch Account
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search + Local Upload trigger */}
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isGoogle ? 'Search in Google Drive...' : 'Search in Dropbox...'}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Upload file from computer directly to this Cloud Drive */}
          <input
            ref={localUploadInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleLocalFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => localUploadInputRef.current?.click()}
            className="w-full sm:w-auto px-3.5 py-2 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload PDF to {isGoogle ? 'Drive' : 'Dropbox'}</span>
          </button>
        </div>

        {/* File List */}
        <div className="p-4 overflow-y-auto max-h-72 space-y-2 flex-1">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching PDF files found in {isGoogle ? 'Google Drive' : 'Dropbox'}.
            </div>
          ) : (
            filteredFiles.map((item) => {
              const isSelected = selectedFileId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedFileId(item.id)}
                  onDoubleClick={handleImportSelected}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100 ring-1 ring-blue-500'
                      : 'border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 shadow-2xs">
                      <FileText className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{item.size}</span>
                        <span>·</span>
                        <span className="truncate">{item.path}</span>
                        <span>·</span>
                        <span>{item.modified}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Public Share Link input fallback */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <form onSubmit={handleImportFromLink} className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <LinkIcon className="w-3 h-3 text-blue-500" />
              <span>Or paste a direct {isGoogle ? 'Google Drive' : 'Dropbox'} shared link:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={directLink}
                onChange={(e) => setDirectLink(e.target.value)}
                placeholder={isGoogle ? 'https://drive.google.com/file/d/...' : 'https://www.dropbox.com/s/...'}
                className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!directLink.trim() || isProcessing}
                className="px-3 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-medium rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                Fetch
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Files process 100% in your browser.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImportSelected}
              disabled={!selectedFileId || isProcessing}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <span>Import to Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
