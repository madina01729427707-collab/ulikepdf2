import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguage } from '../../i18n/translations';

interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  locale: string;
}

const SEO_DATA: Record<SupportedLanguage, SEOConfig> = {
  bn: {
    title: 'uLikePDF – ফ্রি অনলাইন PDF টুলস | মার্জ, স্প্লিট, কম্প্রেস ও এডিট করুন',
    description: '১০০% নিরাপদ ও সম্পূর্ণ ফ্রি অনলাইন পিডিএফ টুলস। কোনো সফটওয়্যার ছাড়াই ব্রাউজারে পিডিএফ মার্জ, স্প্লিট, সাইজ ছোট (কম্প্রেস), কনভার্ট, এডিট, পেজ নম্বর ও সাইন করুন।',
    keywords: 'পিডিএফ মার্জ, পিডিএফ কম্প্রেস, পিডিএফ কনভার্ট, ফ্রি পিডিএফ টুলস, অনলাইন পিডিএফ এডিটর, পিডিএফ সাইজ কমানো, পিডিএফ ওয়ার্ড কনভার্টার, ulikepdf, ilovepdf বিকল্প',
    locale: 'bn_BD',
  },
  en: {
    title: 'uLikePDF – Free Online PDF Tools to Merge, Split, Compress & Edit',
    description: '100% private, free client-side PDF tools. Merge, split, compress, convert, edit, sign, and protect PDF files directly in your browser with zero server uploads.',
    keywords: 'pdf tools, merge pdf, split pdf, compress pdf, convert pdf to word, pdf editor online free, ilovepdf alternative, sejda alternative, ulikepdf.com',
    locale: 'en_US',
  },
  es: {
    title: 'uLikePDF – Herramientas PDF Online Gratis | Unir, Dividir, Comprimir',
    description: 'Herramientas PDF online 100% privadas y gratis. Une, divide, comprime, convierte, edita y protege documentos PDF directamente en tu navegador sin subir archivos.',
    keywords: 'herramientas pdf gratis, unir pdf, dividir pdf, comprimir pdf, convertir pdf a word, editor pdf online, alternativa ilovepdf, ulikepdf',
    locale: 'es_ES',
  },
  fr: {
    title: 'uLikePDF – Outils PDF en Ligne Gratuits | Fusionner, Diviser, Compresser',
    description: 'Outils PDF en ligne 100% gratuits et sécurisés. Fusionnez, divisez, compressez, convertissez, éditez et signez vos documents PDF directement dans votre navigateur.',
    keywords: 'outils pdf gratuits, fusionner pdf, compresser pdf, convertir pdf en word, editeur pdf en ligne, ulikepdf',
    locale: 'fr_FR',
  },
  de: {
    title: 'uLikePDF – Kostenlose Online-PDF-Tools | Zusammenfügen, Verkleinern',
    description: '100% private, kostenlose Online-PDF-Werkzeuge. PDF zusammenfügen, teilen, verkleinern, umwandeln, bearbeiten und schützen ohne Server-Uploads.',
    keywords: 'pdf tools kostenlos, pdf zusammenfügen, pdf verkleinern, pdf in word umwandeln, pdf editor online, ulikepdf',
    locale: 'de_DE',
  },
  it: {
    title: 'uLikePDF – Strumenti PDF Online Gratuiti | Unisci, Dividi, Comprimi',
    description: 'Strumenti PDF online gratuiti e privati al 100%. Unisci, dividi, comprimi, converti, modifica e firma file PDF direttamente nel tuo browser.',
    keywords: 'strumenti pdf gratis, unire pdf, comprimere pdf, convertire pdf in word, modifica pdf online, ulikepdf',
    locale: 'it_IT',
  },
  pt: {
    title: 'uLikePDF – Ferramentas PDF Online Grátis | Juntar, Dividir, Comprimir',
    description: 'Ferramentas PDF online 100% gratuitas e seguras. Junte, divida, comprima, converta, edite e assine arquivos PDF diretamente no seu navegador.',
    keywords: 'ferramentas pdf gratis, juntar pdf, comprimir pdf, converter pdf em word, editor pdf online, ulikepdf',
    locale: 'pt_BR',
  },
  ja: {
    title: 'uLikePDF – 無料オンラインPDFツール | 結合・分割・圧縮・変換',
    description: '100%安全で無料のオンラインPDFツール。サーバーにファイルをアップロードせず、ブラウザ上でPDFの結合、分割、圧縮、Word変換、署名が瞬時に行えます。',
    keywords: 'PDF結合, PDF分割, PDF圧縮, PDF Word 変換, PDF編集 無料, オンラインPDFツール, ulikepdf',
    locale: 'ja_JP',
  },
  ru: {
    title: 'uLikePDF – Бесплатные онлайн PDF инструменты | Объединить, Сжать, Разделить',
    description: '100% приватные бесплатные онлайн-инструменты для работы с PDF. Объединяйте, разделяйте, сжимайте, конвертируйте и редактируйте PDF прямо в браузере.',
    keywords: 'pdf инструменты, объединить pdf, сжать pdf, конвертировать pdf в word, редактировать pdf онлайн бесплатно, ulikepdf',
    locale: 'ru_RU',
  },
  ko: {
    title: 'uLikePDF – 무료 온라인 PDF 도구 | PDF 합치기, 분할, 압축 및 변환',
    description: '100% 안전하고 무료인 브라우저 기반 PDF 도구. 서버 업로드 없이 로컬 브라우저에서 PDF 합치기, 나누기, 압축, 변환, 서명을 즉시 처리하세요.',
    keywords: 'PDF 합치기, PDF 압축, PDF 변환, 무료 PDF 편집기, 온라인 PDF 툴, ulikepdf',
    locale: 'ko_KR',
  },
  'zh-CN': {
    title: 'uLikePDF – 免费在线PDF工具 | 合并、拆分、压缩与格式转换',
    description: '100%私密且完全免费的在线PDF工具箱。无需上传服务器，直接在浏览器中秒级完成PDF合并、分割、压缩、转Word、签名与加密。',
    keywords: 'PDF合并, PDF拆分, PDF压缩, PDF转Word, 免费在线PDF编辑, ulikepdf',
    locale: 'zh_CN',
  },
  'zh-TW': {
    title: 'uLikePDF – 免費線上PDF工具 | 合併、分割、壓縮與格式轉換',
    description: '100%隱私安全的免費線上PDF工具。在瀏覽器本地快速完成PDF合併、分割、壓縮、轉Word、編輯及電子簽名。',
    keywords: 'PDF合併, PDF分割, PDF壓縮, PDF轉Word, 線上PDF編輯器, ulikepdf',
    locale: 'zh_TW',
  },
  ar: {
    title: 'uLikePDF – أدوات PDF مجانية عبر الإنترنت | دمج، ضغط، وتحويل',
    description: 'أدوات PDF مجانية وآمنة 100٪ في متصفحك. قم بدمج وتقسيم وضغط وتحويل وتعديل وتوقيع ملفات PDF بدون رفعها إلى خوادم خارجية.',
    keywords: 'أدوات pdf, دمج pdf, ضغط pdf, تحويل pdf إلى word, تعديل pdf مجانا, ulikepdf',
    locale: 'ar_SA',
  },
  bg: {
    title: 'uLikePDF – Безплатни онлайн PDF инструменти | Обединяване, Свиване',
    description: '100% сигурни безплатни онлайн инструменти за PDF. Обединявайте, разделяйте, компресирайте и конвертирайте PDF директно в браузъра.',
    keywords: 'pdf инструменти, обединяване на pdf, компресиране на pdf, ulikepdf',
    locale: 'bg_BG',
  },
  ca: {
    title: 'uLikePDF – Eines PDF Online Gratuïtes | Unir, Dividir, Comprimir',
    description: 'Eines PDF online 100% privades i gratuïtes. Uneix, divideix, comprimeix i converteix documents PDF directament al teu navegador.',
    keywords: 'eines pdf, unir pdf, comprimir pdf, ulikepdf',
    locale: 'ca_ES',
  },
  nl: {
    title: 'uLikePDF – Gratis Online PDF Tools | Samenvoegen, Splitsen, Comprimeren',
    description: '100% veilige en gratis online PDF gereedschappen. PDF bestanden samenvoegen, splitsen, verkleinen, bewerken en converteren in uw browser.',
    keywords: 'pdf tools gratis, pdf samenvoegen, pdf verkleinen, pdf converteren, ulikepdf',
    locale: 'nl_NL',
  },
  el: {
    title: 'uLikePDF – Δωρεάν Online Εργαλεία PDF | Συγχώνευση, Συμπίεση',
    description: '100% ασφαλή και δωρεάν διαδικτυακά εργαλεία PDF. Συγχωνεύστε, διαχωρίστε, συμπιέστε και μετατρέψτε αρχεία PDF στο πρόγραμμα περιήγησης.',
    keywords: 'εργαλεία pdf, συγχώνευση pdf, συμπίεση pdf, ulikepdf',
    locale: 'el_GR',
  },
  hi: {
    title: 'uLikePDF – मुफ्त ऑनलाइन PDF टूल्स | मर्ज, स्प्लिट, कंप्रेस और कन्वर्ट',
    description: '100% सुरक्षित और पूरी तरह से मुफ्त ऑनलाइन पीडीएफ टूल्स। अपने ब्राउज़र में तुरंत पीडीएफ मर्ज, कंप्रेस, स्प्लिट और कन्वर्ट करें।',
    keywords: 'पीडीएफ मर्ज, पीडीएफ कंप्रेस, पीडीएफ कन्वर्ट, फ्री पीडीएफ टूल्स, ऑनलाइन पीडीएफ एडिटर, ulikepdf',
    locale: 'hi_IN',
  },
  id: {
    title: 'uLikePDF – Alat PDF Online Gratis | Gabung, Pisah, Kompres PDF',
    description: 'Alat PDF online 100% gratis dan aman. Gabungkan, pisahkan, kompres, konversi, dan edit dokumen PDF langsung di browser Anda tanpa upload.',
    keywords: 'alat pdf gratis, gabung pdf, kompres pdf, konversi pdf ke word, ulikepdf',
    locale: 'id_ID',
  },
  ms: {
    title: 'uLikePDF – Alatan PDF Dalam Talian Percuma | Gabung, Mampat PDF',
    description: 'Alatan PDF dalam talian 100% selamat dan percuma. Gabungkan, pisahkan, mampatkan dan tukar fail PDF dalam pelayar anda.',
    keywords: 'alatan pdf percuma, gabung pdf, mampat pdf, tukar pdf, ulikepdf',
    locale: 'ms_MY',
  },
  pl: {
    title: 'uLikePDF – Darmowe Narzędzia PDF Online | Łączenie, Kompresja',
    description: 'W 100% prywatne i bezpłatne narzędzia PDF. Łącz, dziel, kompresuj, konwertuj i edytuj pliki PDF bezpośrednio w przeglądarce.',
    keywords: 'narzędzia pdf, łączenie pdf, kompresja pdf, konwersja pdf, ulikepdf',
    locale: 'pl_PL',
  },
  sv: {
    title: 'uLikePDF – Gratis PDF-verktyg Online | Slå ihop, Komprimera',
    description: '100% säkra och kostnadsfria PDF-verktyg online. Slå samman, dela, komprimera och konvertera PDF-filer direkt i din webbläsare.',
    keywords: 'pdf verktyg gratis, slå ihop pdf, komprimera pdf, ulikepdf',
    locale: 'sv_SE',
  },
  th: {
    title: 'uLikePDF – เครื่องมือ PDF ออนไลน์ฟรี | รวมไฟล์ แยกไฟล์ บีบอัด PDF',
    description: 'เครื่องมือ PDF ออนไลน์ฟรีและปลอดภัย 100% รวม แยก บีบอัด แปลง และแก้ไขเอกสาร PDF ในเบราว์เซอร์ของคุณโดยไม่ต้องอัปโหลดขึ้นเซิร์ฟเวอร์',
    keywords: 'เครื่องมือ pdf, รวมไฟล์ pdf, บีบอัด pdf, แปลง pdf, ulikepdf',
    locale: 'th_TH',
  },
  tr: {
    title: 'uLikePDF – Ücretsiz Çevrimiçi PDF Araçları | Birleştir, Sıkıştır',
    description: '%100 güvenli ve ücretsiz çevrimiçi PDF araçları. PDF dosyalarını tarayıcınızda sunucuya yüklemeden birleştirin, bölün, sıkıştırın ve dönüştürün.',
    keywords: 'pdf araçları ücretsiz, pdf birleştirme, pdf sıkıştırma, pdf dönüştürücü, ulikepdf',
    locale: 'tr_TR',
  },
  uk: {
    title: 'uLikePDF – Безкоштовні онлайн інструменти PDF | Об\'єднати, Стиснути',
    description: '100% конфіденційні та безкоштовні PDF інструменти. Об\'єднуйте, розділяйте, стискайте та конвертуйте PDF безпосередньо у браузері.',
    keywords: 'pdf інструменти, обєднати pdf, стиснути pdf, конвертувати pdf, ulikepdf',
    locale: 'uk_UA',
  },
  vi: {
    title: 'uLikePDF – Công Cụ PDF Trực Tuyến Miễn Phí | Ghép, Nén PDF',
    description: 'Công cụ PDF trực tuyến 100% miễn phí và bảo mật. Ghép, tách, nén và chuyển đổi tài liệu PDF ngay trong trình duyệt của bạn.',
    keywords: 'công cụ pdf, ghép pdf, nén pdf, ulikepdf',
    locale: 'vi_VN',
  },
  sw: {
    title: 'uLikePDF – Zana za PDF Mtandaoni Bure | Unganisha, Bana PDF',
    description: 'Zana za PDF mtandaoni zilizo salama na za bure 100%. Unganisha, gawanya, bana na badilisha hati za PDF moja kwa moja kwenye kivinjari.',
    keywords: 'zana za pdf, unganisha pdf, bana pdf, ulikepdf',
    locale: 'sw_KE',
  },
};

export const SEOHead: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const config = SEO_DATA[language] || SEO_DATA.en;

    // Dynamic Title
    document.title = config.title;

    // Helper to set or create meta tags
    const setMeta = (nameOrProperty: string, content: string, isProperty = false) => {
      const attr = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`;
      let element = document.querySelector(attr);
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', nameOrProperty);
        } else {
          element.setAttribute('name', nameOrProperty);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update Meta Description & Keywords
    setMeta('description', config.description);
    setMeta('keywords', config.keywords);

    // Update OpenGraph
    setMeta('og:title', config.title, true);
    setMeta('og:description', config.description, true);
    setMeta('og:locale', config.locale, true);
    setMeta('og:url', `https://ulikepdf.com${location.pathname}`, true);

    // Update Twitter Cards
    setMeta('twitter:title', config.title);
    setMeta('twitter:description', config.description);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://ulikepdf.com${location.pathname}`);
  }, [language, location.pathname]);

  return null;
};
