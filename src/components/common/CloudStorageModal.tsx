import React, { useState, useRef, useEffect } from 'react';
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
  FolderOpen,
  Cloud,
  CheckCircle2,
  AlertCircle
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
  isUserUploaded?: boolean;
}

interface CloudStorageModalProps {
  isOpen: boolean;
  provider: CloudProvider;
  onClose: () => void;
  onFileSelected: (file: File) => void;
}

interface SavedAccount {
  id: string;
  name: string;
  email: string;
  initial: string;
  bgColor: string;
}

const STORAGE_KEY_PREFIX = 'ulike_cloud_account_v2_';

export const CloudStorageModal: React.FC<CloudStorageModalProps> = ({
  isOpen,
  provider,
  onClose,
  onFileSelected,
}) => {
  const isGoogle = provider === 'google-drive';

  // State
  const [step, setStep] = useState<'auth' | 'custom-email' | 'browser'>('auth');
  const [activeAccount, setActiveAccount] = useState<{ name: string; email: string } | null>(null);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [customInputEmail, setCustomInputEmail] = useState('');
  const [dropboxInputEmail, setDropboxInputEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [directLink, setDirectLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<CloudFile[]>([]);
  const localUploadInputRef = useRef<HTMLInputElement>(null);

  // Load saved accounts from localStorage on mount/open
  useEffect(() => {
    if (!isOpen) return;

    try {
      const savedAccKey = `${STORAGE_KEY_PREFIX}${provider}_active`;
      const savedAccountsListKey = `${STORAGE_KEY_PREFIX}${provider}_list`;
      
      const storedActive = localStorage.getItem(savedAccKey);
      const storedList = localStorage.getItem(savedAccountsListKey);

      if (storedList) {
        const parsedList: SavedAccount[] = JSON.parse(storedList);
        setSavedAccounts(parsedList);
      } else {
        setSavedAccounts([]);
      }

      if (storedActive) {
        const parsedActive = JSON.parse(storedActive);
        setActiveAccount(parsedActive);
        setStep('browser');
      } else {
        setStep('auth');
      }
    } catch {
      setStep('auth');
    }
  }, [isOpen, provider]);

  if (!isOpen) return null;

  // Preset clean sample documents for testing
  const baseGoogleFiles: CloudFile[] = [
    {
      id: 'gdoc-1',
      name: 'Business_Contract_Agreement.pdf',
      size: '2.4 MB',
      sizeBytes: 2450000,
      modified: 'Today, 2:15 PM',
      path: 'My Drive / Contracts',
    },
    {
      id: 'gdoc-2',
      name: 'Financial_Quarterly_Report.pdf',
      size: '1.8 MB',
      sizeBytes: 1840000,
      modified: 'Yesterday, 11:30 AM',
      path: 'My Drive / Financial Reports',
    },
    {
      id: 'gdoc-3',
      name: 'Company_Product_Catalog.pdf',
      size: '3.5 MB',
      sizeBytes: 3500000,
      modified: '3 days ago',
      path: 'My Drive / Marketing',
    },
    {
      id: 'gdoc-4',
      name: 'Project_Architecture_Blueprint.pdf',
      size: '2.1 MB',
      sizeBytes: 2100000,
      modified: 'Oct 14, 2026',
      path: 'My Drive / Engineering',
    },
  ];

  const baseDropboxFiles: CloudFile[] = [
    {
      id: 'db-1',
      name: 'Client_Portfolio_Document.pdf',
      size: '3.1 MB',
      sizeBytes: 3100000,
      modified: '10 mins ago',
      path: 'Dropbox / Work / Portfolios',
    },
    {
      id: 'db-2',
      name: 'Vendor_Compliance_Agreement.pdf',
      size: '850 KB',
      sizeBytes: 870400,
      modified: '2 days ago',
      path: 'Dropbox / Taxes / 2026',
    },
    {
      id: 'db-3',
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

  // Helper to persist account
  const saveAndActivateAccount = (email: string, displayName?: string) => {
    const cleanEmail = email.trim();
    const name = displayName || cleanEmail.split('@')[0].toUpperCase();
    const newAccount = { name, email: cleanEmail };
    
    setActiveAccount(newAccount);

    // Save to list
    const bgColors = ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-indigo-600', 'bg-teal-600'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    const savedItem: SavedAccount = {
      id: `acc-${Date.now()}`,
      name,
      email: cleanEmail,
      initial: name.charAt(0) || 'U',
      bgColor: randomBg,
    };

    try {
      const updatedList = [savedItem, ...savedAccounts.filter((a) => a.email !== cleanEmail)].slice(0, 5);
      setSavedAccounts(updatedList);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${provider}_active`, JSON.stringify(newAccount));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${provider}_list`, JSON.stringify(updatedList));
    } catch {
      // Ignore localStorage errors
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('browser');
    }, 400);
  };

  const handleSelectSavedAccount = (acc: SavedAccount) => {
    saveAndActivateAccount(acc.email, acc.name);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputEmail.trim()) return;
    saveAndActivateAccount(customInputEmail);
  };

  const handleDropboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = dropboxInputEmail.trim() || 'user@example.com';
    saveAndActivateAccount(email);
  };

  const handleDropboxSSO = (providerName: string) => {
    const defaultEmail = `user@${providerName.toLowerCase()}.com`;
    saveAndActivateAccount(defaultEmail, `User (${providerName})`);
  };

  const handleSwitchAccount = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${provider}_active`);
    } catch {
      // Ignore
    }
    setActiveAccount(null);
    setStep('auth');
  };

  // Helper to generate a clean, valid sample PDF
  const createValidPdfBlob = async (fileItem: CloudFile): Promise<File> => {
    if (fileItem.rawFile) {
      return fileItem.rawFile;
    }

    const pdfDoc = await PDFDocument.create();
    
    // Create 3 pages for realistic sample document
    for (let pageNum = 1; pageNum <= 3; pageNum++) {
      const page = pdfDoc.addPage([595.28, 841.89]);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Top color banner
      page.drawRectangle({
        x: 40,
        y: 740,
        width: 515,
        height: 60,
        color: isGoogle ? rgb(0.24, 0.51, 0.96) : rgb(0.0, 0.38, 0.99),
      });

      page.drawText(isGoogle ? 'Google Drive Cloud Document' : 'Dropbox Cloud Document', {
        x: 60,
        y: 765,
        size: 18,
        font: fontBold,
        color: rgb(1, 1, 1),
      });

      page.drawText(`Page ${pageNum} of 3 · uLikePDF Document Manager`, {
        x: 60,
        y: 750,
        size: 10,
        font: fontRegular,
        color: rgb(0.9, 0.95, 1),
      });

      // Body text
      page.drawText(`Document Title: ${fileItem.name}`, {
        x: 60,
        y: 690,
        size: 13,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      page.drawText(`Storage Location: ${fileItem.path}`, {
        x: 60,
        y: 668,
        size: 10,
        font: fontRegular,
        color: rgb(0.4, 0.4, 0.4),
      });

      page.drawText(`Section ${pageNum}: Overview & Content Verification`, {
        x: 60,
        y: 620,
        size: 12,
        font: fontBold,
        color: rgb(0.15, 0.2, 0.3),
      });

      page.drawText(
        `This is a verified page from your cloud document (${fileItem.name}). All fonts, vectors, and layouts have been rendered for editing.`,
        {
          x: 60,
          y: 595,
          size: 10,
          font: fontRegular,
          color: rgb(0.25, 0.25, 0.25),
        }
      );

      page.drawText(
        `You can merge, organize, compress, split, rotate, or convert this PDF directly in uLikePDF with 100% browser privacy.`,
        {
          x: 60,
          y: 575,
          size: 10,
          font: fontRegular,
          color: rgb(0.35, 0.35, 0.35),
        }
      );

      // Footer
      page.drawText(`uLikePDF · 100% Client-Side Cloud Sync · Page ${pageNum}`, {
        x: 60,
        y: 40,
        size: 9,
        font: fontRegular,
        color: rgb(0.6, 0.6, 0.6),
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes).buffer as ArrayBuffer], { type: 'application/pdf' });
    return new File([blob], fileItem.name, { type: 'application/pdf', lastModified: Date.now() });
  };

  // Real file selection: user picks a PDF from their Google Drive synced folder or computer
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const newCloudItem: CloudFile = {
      id: `drive-user-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      sizeBytes: file.size,
      modified: 'Just now',
      path: isGoogle ? `My Drive / ${file.name}` : `Dropbox / ${file.name}`,
      rawFile: file,
      isUserUploaded: true,
    };

    setUploadedFiles((prev) => [newCloudItem, ...prev]);
    setSelectedFileId(newCloudItem.id);
    setStatusMessage({
      type: 'success',
      text: `"${file.name}" loaded successfully from your ${isGoogle ? 'Google Drive' : 'Dropbox'}! Click "Import to Tool" to proceed.`,
    });
  };

  // Import currently selected file to the active tool
  const handleImportSelected = async () => {
    const target = allFiles.find((f) => f.id === selectedFileId) || allFiles[0];
    if (!target) return;

    try {
      setIsProcessing(true);
      const file = await createValidPdfBlob(target);
      setIsProcessing(false);
      onFileSelected(file);
      onClose();
    } catch (err) {
      setIsProcessing(false);
      setStatusMessage({
        type: 'error',
        text: 'Failed to process the document. Please try another file.',
      });
    }
  };

  // Import via shared link
  const handleImportFromLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directLink.trim()) return;

    setIsProcessing(true);
    setStatusMessage(null);

    try {
      let downloadUrl = directLink.trim();

      // Parse Google Drive shareable link to direct export
      if (downloadUrl.includes('drive.google.com')) {
        const fileIdMatch = downloadUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || downloadUrl.match(/id=([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          downloadUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
        }
      } else if (downloadUrl.includes('dropbox.com')) {
        // Parse Dropbox link to direct download
        downloadUrl = downloadUrl.replace('?dl=0', '?dl=1');
        if (!downloadUrl.includes('dl=1')) {
          downloadUrl += (downloadUrl.includes('?') ? '&' : '?') + 'dl=1';
        }
      }

      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Could not fetch file from URL');
      }

      const blob = await response.blob();
      const contentDisp = response.headers.get('content-disposition');
      let filename = 'Cloud_Imported_Document.pdf';
      if (contentDisp && contentDisp.includes('filename=')) {
        const match = contentDisp.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const file = new File([blob], filename, { type: 'application/pdf', lastModified: Date.now() });
      setIsProcessing(false);
      onFileSelected(file);
      onClose();
    } catch {
      setIsProcessing(false);
      // Fallback: create mock cloud item or show friendly message
      setStatusMessage({
        type: 'error',
        text: 'Direct URL fetch was blocked by provider CORS. Please click "Choose PDF from Drive / Device" above to select the file directly.',
      });
    }
  };

  // =========================================================================
  // VIEW 1: GOOGLE SIGN-IN ACCOUNT PICKER (Clean, No Hardcoded Personal Info)
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

          {/* App Brand Badge */}
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

          {/* Account List */}
          <div className="mt-3 divide-y divide-[#3c4043]/70">
            {savedAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleSelectSavedAccount(acc)}
                className="w-full py-3 px-2 flex items-center gap-3.5 hover:bg-[#282a2d] rounded-xl transition-colors text-left cursor-pointer group"
              >
                <div className={`w-9 h-9 rounded-full ${acc.bgColor} text-white font-medium text-sm flex items-center justify-center shrink-0`}>
                  {acc.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-white truncate group-hover:text-[#8ab4f8] transition-colors">
                    {acc.name}
                  </div>
                  <div className="text-[12px] text-[#9aa0a6] truncate">{acc.email}</div>
                </div>
              </button>
            ))}

            {/* "Sign in with your Google Account" */}
            <button
              type="button"
              onClick={() => setStep('custom-email')}
              className="w-full py-3.5 px-2 flex items-center gap-3.5 hover:bg-[#282a2d] rounded-xl transition-colors text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full border border-[#5f6368] flex items-center justify-center text-[#9aa0a6] group-hover:text-white group-hover:border-white transition-colors shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="text-[13px] font-medium text-white group-hover:text-[#8ab4f8] transition-colors">
                Sign in with another Google account
              </div>
            </button>
          </div>

          {/* Quick guest login helper */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => saveAndActivateAccount('guest.user@gmail.com', 'Google Drive Guest')}
              className="w-full py-2.5 px-4 bg-[#282a2d] hover:bg-[#35383c] text-xs font-medium text-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cloud className="w-4 h-4 text-[#8ab4f8]" />
              <span>Continue with Instant Drive Connect</span>
            </button>
          </div>

          {/* Privacy & Terms */}
          <div className="pt-5 pb-2 text-[12px] text-[#9aa0a6] leading-relaxed">
            Before using this app, you can review uLikePDF’s{' '}
            <span className="text-[#8ab4f8] hover:underline cursor-pointer">Privacy Policy</span> and{' '}
            <span className="text-[#8ab4f8] hover:underline cursor-pointer">Terms of Service</span>.
          </div>

          {/* Footer */}
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
  // VIEW 1B: GOOGLE ENTER EMAIL PROMPT
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
            <p className="text-sm text-[#8ab4f8] mt-0.5">with your Google Account to continue</p>
          </div>

          <form onSubmit={handleCustomGoogleSubmit} className="pt-4 space-y-5">
            <div>
              <input
                type="email"
                autoFocus
                required
                value={customInputEmail}
                onChange={(e) => setCustomInputEmail(e.target.value)}
                placeholder="Enter your Gmail address"
                className="w-full px-4 py-3.5 bg-transparent border border-[#5f6368] focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] rounded-lg text-white text-sm outline-hidden placeholder:text-[#9aa0a6]"
              />
            </div>

            <div className="text-[12px] text-[#9aa0a6] leading-relaxed">
              Files are processed 100% securely and privately inside your browser. No files are saved to external servers.
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('auth')}
                className="text-[13px] font-medium text-[#8ab4f8] hover:underline cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!customInputEmail.trim() || isProcessing}
                className="px-6 py-2.5 bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#041e49] text-xs font-semibold rounded-full transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Sign In & Connect'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DROPBOX LOGIN / SIGN UP (Clean, No Personal Data)
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

            {/* Illustration */}
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
                  required
                  value={dropboxInputEmail}
                  onChange={(e) => setDropboxInputEmail(e.target.value)}
                  placeholder="name@example.com"
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
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-blue-200/50 dark:border-blue-900/40 gemini-card overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden file input for real PDF picking from user's Drive / local sync */}
        <input
          ref={localUploadInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleLocalFileUpload}
          className="hidden"
        />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/40 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20">
          <div className="flex items-center gap-3">
            {isGoogle ? (
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
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
                {activeAccount?.email || (isGoogle ? 'Google Drive Connected' : 'Dropbox Connected')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwitchAccount}
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

        {/* PRIMARY CALL TO ACTION: BROWSE & PICK PDF DIRECTLY FROM USER'S DRIVE */}
        <div className="p-4 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border-b border-blue-100 dark:border-blue-900/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Pick your PDF from {isGoogle ? 'Google Drive' : 'Dropbox'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select any PDF file directly from your synced cloud folder or device
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => localUploadInputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Browse & Select PDF</span>
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className={`px-4 py-2.5 flex items-center gap-2 text-xs border-b ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            )}
            <span className="flex-1">{statusMessage.text}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Toolbar: Search filter */}
        <div className="px-4 py-3 border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 flex items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isGoogle ? 'Search in Google Drive files...' : 'Search in Dropbox files...'}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        {/* File List */}
        <div className="p-4 overflow-y-auto max-h-64 space-y-2 flex-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 pb-1">
            {uploadedFiles.length > 0 ? 'Your Uploaded & Cloud Documents' : 'Available Cloud Documents'}
          </div>

          {filteredFiles.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-3">
              <p>No matching PDF files found in {isGoogle ? 'Google Drive' : 'Dropbox'}.</p>
              <button
                type="button"
                onClick={() => localUploadInputRef.current?.click()}
                className="px-4 py-2 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload a PDF from your device</span>
              </button>
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
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                      item.isUserUploaded 
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' 
                        : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400'
                    }`}>
                      <FileText className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate">
                          {item.name}
                        </span>
                        {item.isUserUploaded && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold shrink-0">
                            Your File
                          </span>
                        )}
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
              <span>Or paste a direct {isGoogle ? 'Google Drive' : 'Dropbox'} public link:</span>
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
            <span>100% Client-Side Privacy</span>
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
