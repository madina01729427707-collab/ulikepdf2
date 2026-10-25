import React, { useEffect, useState, useRef } from 'react';
import { 
  RotateCw, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  ArrowLeft, 
  ArrowRight,
  GripVertical,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { loadPdfDocument, renderPageThumbnail, renderPageToCanvas } from '../../lib/pdf/pdfjs-init';

export interface PageItem {
  pageNumber: number; // 1-indexed original page number
  thumbnailUrl: string;
  rotation: number; // additional rotation in degrees (0, 90, 180, 270)
  selected: boolean;
}

interface PagePreviewGridProps {
  file: File;
  pages: PageItem[];
  onPagesChange: (pages: PageItem[]) => void;
  mode?: 'reorder' | 'select' | 'rotate' | 'organize';
}

type GridSize = 'small' | 'medium' | 'large' | 'xlarge';

export const PagePreviewGrid: React.FC<PagePreviewGridProps> = ({
  file,
  pages,
  onPagesChange,
  mode = 'organize',
}) => {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [gridSize, setGridSize] = useState<GridSize>('medium');

  // Drag and drop states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);

  // Modal / Lightbox zoom preview states
  const [modalPageIndex, setModalPageIndex] = useState<number | null>(null);
  const [modalZoom, setModalZoom] = useState<number>(100);
  const [highResUrl, setHighResUrl] = useState<string | null>(null);
  const [highResLoading, setHighResLoading] = useState<boolean>(false);

  // Cache loaded pdfDoc for high-res previews
  const pdfDocRef = useRef<any>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadThumbnails() {
      try {
        setLoading(true);
        const buffer = await file.arrayBuffer();
        const pdfDoc = await loadPdfDocument(buffer);
        pdfDocRef.current = pdfDoc;
        const total = pdfDoc.numPages;
        const loadedPages: PageItem[] = [];

        for (let i = 1; i <= total; i++) {
          if (isCancelled) return;
          const thumb = await renderPageThumbnail(pdfDoc, i, 260);
          loadedPages.push({
            pageNumber: i,
            thumbnailUrl: thumb,
            rotation: 0,
            selected: true,
          });
          setLoadingProgress(Math.round((i / total) * 100));
        }

        if (!isCancelled) {
          onPagesChange(loadedPages);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load page thumbnails', err);
        if (!isCancelled) setLoading(false);
      }
    }

    loadThumbnails();

    return () => {
      isCancelled = true;
    };
  }, [file]);

  // Handle high-res rendering when modal opens or page changes
  useEffect(() => {
    if (modalPageIndex === null || !pages[modalPageIndex]) {
      setHighResUrl(null);
      return;
    }

    let isCancelled = false;
    const targetPage = pages[modalPageIndex];

    async function renderHighRes() {
      try {
        setHighResLoading(true);
        let pdfDoc = pdfDocRef.current;
        if (!pdfDoc) {
          const buffer = await file.arrayBuffer();
          pdfDoc = await loadPdfDocument(buffer);
          pdfDocRef.current = pdfDoc;
        }

        // Render at 2.0x scale for crisp reading
        const canvas = await renderPageToCanvas(pdfDoc, targetPage.pageNumber, 2.0);
        if (!isCancelled) {
          setHighResUrl(canvas.toDataURL('image/jpeg', 0.92));
          setHighResLoading(false);
        }
      } catch (err) {
        console.error('Failed to render high-res page preview', err);
        if (!isCancelled) {
          // Fallback to thumbnail
          setHighResUrl(targetPage.thumbnailUrl);
          setHighResLoading(false);
        }
      }
    }

    renderHighRes();

    return () => {
      isCancelled = true;
    };
  }, [modalPageIndex, file, pages]);

  // Keyboard navigation for preview modal
  useEffect(() => {
    if (modalPageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalPageIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setModalPageIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        setModalPageIndex(prev => (prev !== null && prev < pages.length - 1 ? prev + 1 : prev));
      } else if (e.key === '+' || e.key === '=') {
        setModalZoom(z => Math.min(250, z + 25));
      } else if (e.key === '-') {
        setModalZoom(z => Math.max(50, z - 25));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalPageIndex, pages.length]);

  const toggleSelectPage = (index: number) => {
    const updated = [...pages];
    updated[index].selected = !updated[index].selected;
    onPagesChange(updated);
  };

  const rotatePage = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = [...pages];
    updated[index].rotation = (updated[index].rotation + 90) % 360;
    onPagesChange(updated);
  };

  const removePage = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (pages.length <= 1) return;
    const updated = pages.filter((_, i) => i !== index);
    onPagesChange(updated);
    if (modalPageIndex !== null) {
      if (updated.length === 0) {
        setModalPageIndex(null);
      } else {
        setModalPageIndex(Math.min(modalPageIndex, updated.length - 1));
      }
    }
  };

  const movePage = (index: number, direction: 'left' | 'right', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === pages.length - 1) return;

    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onPagesChange(updated);
  };

  const rotateAll = (deg: number = 90) => {
    const updated = pages.map(p => ({
      ...p,
      rotation: (p.rotation + deg) % 360,
    }));
    onPagesChange(updated);
  };

  const selectAll = (select: boolean) => {
    const updated = pages.map(p => ({
      ...p,
      selected: select,
    }));
    onPagesChange(updated);
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedIndex === null || draggedIndex === index) {
      setDropTargetIndex(null);
      setDropPosition(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    const pos = e.clientX < midX ? 'before' : 'after';

    setDropTargetIndex(index);
    setDropPosition(pos);
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (dropTargetIndex === index) {
        setDropTargetIndex(null);
        setDropPosition(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || dropTargetIndex === null) {
      setDraggedIndex(null);
      setDropTargetIndex(null);
      setDropPosition(null);
      return;
    }

    if (draggedIndex === index) {
      setDraggedIndex(null);
      setDropTargetIndex(null);
      setDropPosition(null);
      return;
    }

    const updated = [...pages];
    const [moved] = updated.splice(draggedIndex, 1);

    let target = dropTargetIndex;
    if (draggedIndex < dropTargetIndex) {
      target = dropPosition === 'before' ? dropTargetIndex - 1 : dropTargetIndex;
    } else {
      target = dropPosition === 'after' ? dropTargetIndex + 1 : dropTargetIndex;
    }
    target = Math.max(0, Math.min(updated.length, target));

    updated.splice(target, 0, moved);
    onPagesChange(updated);

    setDraggedIndex(null);
    setDropTargetIndex(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
    setDropPosition(null);
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Generating page previews... ({loadingProgress}%)
        </p>
      </div>
    );
  }

  const gridClasses: Record<GridSize, string> = {
    small: 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3',
    medium: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4',
    large: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5',
    xlarge: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6',
  };

  return (
    <div className="space-y-4">
      {/* Grid Toolbar with Size and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {pages.length} Pages Loaded
          </span>
          {mode === 'select' && (
            <span className="text-slate-500">
              ({pages.filter(p => p.selected).length} selected)
            </span>
          )}

          {/* Quick instructions for drag & drop */}
          {(mode === 'organize' || mode === 'reorder') && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium text-[11px]">
              <GripVertical className="w-3 h-3 text-blue-500" />
              <span>Drag & drop cards to reorder</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom / Size switcher */}
          <div className="inline-flex items-center bg-white dark:bg-slate-700/80 rounded-xl p-0.5 border border-slate-200 dark:border-slate-600">
            <button
              type="button"
              onClick={() => setGridSize('small')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                gridSize === 'small'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title="Small grid (overview)"
            >
              S
            </button>
            <button
              type="button"
              onClick={() => setGridSize('medium')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                gridSize === 'medium'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title="Medium grid (default)"
            >
              M
            </button>
            <button
              type="button"
              onClick={() => setGridSize('large')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                gridSize === 'large'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title="Large grid (detailed)"
            >
              L
            </button>
            <button
              type="button"
              onClick={() => setGridSize('xlarge')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                gridSize === 'xlarge'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title="Extra large (zoom reading view)"
            >
              XL
            </button>
          </div>

          {(mode === 'rotate' || mode === 'organize') && (
            <button
              type="button"
              onClick={() => rotateAll(90)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate All 90°</span>
            </button>
          )}

          {mode === 'select' && (
            <>
              <button
                type="button"
                onClick={() => selectAll(true)}
                className="px-2.5 py-1.5 font-medium rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => selectAll(false)}
                className="px-2.5 py-1.5 font-medium rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100"
              >
                Deselect All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pages Grid with Drag & Drop & Zoom */}
      <div className={gridClasses[gridSize]}>
        {pages.map((p, idx) => {
          const isDragging = draggedIndex === idx;
          const isDropTarget = dropTargetIndex === idx;
          const isReorderable = mode === 'organize' || mode === 'reorder';

          return (
            <div
              key={`${p.pageNumber}-${idx}`}
              draggable={isReorderable}
              onDragStart={(e) => isReorderable && handleDragStart(e, idx)}
              onDragOver={(e) => isReorderable && handleDragOver(e, idx)}
              onDragLeave={(e) => isReorderable && handleDragLeave(e, idx)}
              onDrop={(e) => isReorderable && handleDrop(e, idx)}
              onDragEnd={isReorderable ? handleDragEnd : undefined}
              onClick={() => mode === 'select' && toggleSelectPage(idx)}
              className={`group relative flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-150 ${
                p.selected
                  ? 'border-slate-200/90 dark:border-slate-800 shadow-xs'
                  : 'border-slate-200/90 dark:border-slate-800 opacity-40'
              } ${
                isDragging
                  ? 'opacity-30 scale-95 border-dashed border-blue-500 ring-2 ring-blue-500/30'
                  : ''
              } ${
                isDropTarget && dropPosition === 'before'
                  ? 'border-l-4 border-l-blue-600 ring-2 ring-blue-500/20'
                  : ''
              } ${
                isDropTarget && dropPosition === 'after'
                  ? 'border-r-4 border-r-blue-600 ring-2 ring-blue-500/20'
                  : ''
              } ${
                isReorderable
                  ? 'cursor-grab active:cursor-grabbing hover:border-blue-400 dark:hover:border-blue-600'
                  : mode === 'select'
                  ? 'cursor-pointer hover:border-blue-500'
                  : ''
              }`}
            >
              {/* Top controls: Drag handle, Page number, and Enlarge button */}
              <div className="w-full flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {isReorderable && (
                    <div 
                      className="text-slate-400 group-hover:text-blue-600 transition-colors p-0.5 rounded cursor-grab"
                      title="Drag to rearrange"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 font-mono">
                    #{idx + 1} <span className="text-slate-400 font-normal">({p.pageNumber})</span>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Click to Enlarge / Zoom Modal Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalPageIndex(idx);
                      setModalZoom(100);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Enlarge & view full page"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {mode === 'select' && (
                    <div className="text-blue-600 dark:text-blue-400">
                      {p.selected ? (
                        <CheckCircle2 className="w-4 h-4 fill-blue-600 text-white dark:text-slate-900" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Page Thumbnail with Rotation & Click-to-Zoom */}
              <div 
                onClick={(e) => {
                  if (mode !== 'select') {
                    e.stopPropagation();
                    setModalPageIndex(idx);
                    setModalZoom(100);
                  }
                }}
                className="w-full aspect-3/4 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-1.5 border border-slate-100 dark:border-slate-800 relative cursor-pointer group/thumb"
                title="Click to view large preview"
              >
                <img
                  src={p.thumbnailUrl}
                  alt={`Page ${p.pageNumber}`}
                  className="max-h-full max-w-full object-contain transition-transform duration-200 drop-shadow-xs"
                  style={{ transform: `rotate(${p.rotation}deg)` }}
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center pointer-events-none rounded-xl">
                  <span className="px-2 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium rounded-lg flex items-center gap-1 shadow-sm">
                    <Maximize2 className="w-3 h-3" />
                    <span>Zoom Page</span>
                  </span>
                </div>
              </div>

              {/* Bottom Quick Controls */}
              <div className="w-full mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-slate-400">
                {(mode === 'reorder' || mode === 'organize') && (
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => movePage(idx, 'left', e)}
                      className="p-1 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 rounded"
                      title="Move page earlier"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === pages.length - 1}
                      onClick={(e) => movePage(idx, 'right', e)}
                      className="p-1 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 rounded"
                      title="Move page later"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {(mode === 'rotate' || mode === 'organize') && (
                  <button
                    type="button"
                    onClick={(e) => rotatePage(idx, e)}
                    className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-auto rounded"
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {mode === 'organize' && (
                  <button
                    type="button"
                    onClick={(e) => removePage(idx, e)}
                    className="p-1 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded ml-1"
                    title="Delete page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Resolution Full-Page Lightbox Modal */}
      {modalPageIndex !== null && pages[modalPageIndex] && (
        <div 
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setModalPageIndex(null)}
        >
          {/* Top Modal Controls */}
          <div 
            className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800 text-white shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm sm:text-base">
                Page {modalPageIndex + 1} of {pages.length}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (Original Document Page #{pages[modalPageIndex].pageNumber})
              </span>
              {pages[modalPageIndex].rotation !== 0 && (
                <span className="px-2 py-0.5 text-[10px] bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-full font-mono">
                  {pages[modalPageIndex].rotation}°
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Zoom In / Out Controls */}
              <div className="inline-flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setModalZoom(z => Math.max(50, z - 25))}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2.5 text-xs font-mono font-medium text-slate-300 min-w-[50px] text-center">
                  {modalZoom}%
                </span>
                <button
                  type="button"
                  onClick={() => setModalZoom(z => Math.min(250, z + 25))}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Rotate Page in Modal */}
              <button
                type="button"
                onClick={() => rotatePage(modalPageIndex)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Rotate this page 90°"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Rotate 90°</span>
              </button>

              {/* Delete Page in Modal (Organize Mode) */}
              {mode === 'organize' && (
                <button
                  type="button"
                  onClick={() => removePage(modalPageIndex)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition-colors"
                  title="Delete this page"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setModalPageIndex(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Close Viewer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Middle Viewer with Left/Right Navigation */}
          <div 
            className="flex-1 relative overflow-auto flex items-center justify-center p-4 sm:p-8"
            onClick={() => setModalPageIndex(null)}
          >
            {/* Previous Page Button */}
            <button
              type="button"
              disabled={modalPageIndex === 0}
              onClick={(e) => {
                e.stopPropagation();
                if (modalPageIndex > 0) setModalPageIndex(modalPageIndex - 1);
              }}
              className="fixed left-4 sm:left-6 z-20 p-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-xl disabled:opacity-20 transition-all hover:scale-105"
              title="Previous Page (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* High-Resolution Document Canvas Viewer */}
            <div 
              className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-150"
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `scale(${modalZoom / 100})`,
                transformOrigin: 'center center',
              }}
            >
              {highResLoading ? (
                <div className="p-12 text-center text-white space-y-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                  <p className="text-xs font-medium">Rendering high-resolution vector page...</p>
                </div>
              ) : highResUrl ? (
                <img
                  src={highResUrl}
                  alt={`High resolution page ${pages[modalPageIndex].pageNumber}`}
                  className="max-h-[82vh] max-w-[85vw] object-contain rounded-lg shadow-2xl bg-white border border-slate-700 transition-transform duration-200"
                  style={{ transform: `rotate(${pages[modalPageIndex].rotation}deg)` }}
                />
              ) : (
                <img
                  src={pages[modalPageIndex].thumbnailUrl}
                  alt={`Page ${pages[modalPageIndex].pageNumber}`}
                  className="max-h-[82vh] max-w-[85vw] object-contain rounded-lg shadow-2xl bg-white border border-slate-700"
                  style={{ transform: `rotate(${pages[modalPageIndex].rotation}deg)` }}
                />
              )}
            </div>

            {/* Next Page Button */}
            <button
              type="button"
              disabled={modalPageIndex === pages.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                if (modalPageIndex < pages.length - 1) setModalPageIndex(modalPageIndex + 1);
              }}
              className="fixed right-4 sm:right-6 z-20 p-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-xl disabled:opacity-20 transition-all hover:scale-105"
              title="Next Page (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Bottom Status Bar */}
          <div 
            className="px-6 py-2.5 bg-slate-900/90 border-t border-slate-800/80 text-center text-xs text-slate-400 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Tip: Use Left/Right Arrow keys to browse pages · '+' and '-' to zoom · Esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
};
