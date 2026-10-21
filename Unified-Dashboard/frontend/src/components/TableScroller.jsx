import React, { useRef, useState, useEffect, useCallback } from 'react';

/**
 * TableScroller provides a smooth, fully interactive horizontal scroller
 * for responsive data tables. Works across:
 * - Desktop browsers (Mouse drag-to-scroll, clickable/draggable custom scrollbar, trackpad/wheel)
 * - Chrome DevTools mobile emulation (Full window pointer listeners ensure touch/pointer drag works)
 * - Real iOS / Android mobile devices (Touch swipe, quick navigation buttons, draggable thumb)
 */
export const TableScroller = ({
  children,
  className = '',
  showHint = true,
  hintText = 'Swipe or use scroller to view all columns',
  minWidth = 660,
}) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const [canScroll, setCanScroll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [thumbWidthPct, setThumbWidthPct] = useState(30);
  const [thumbLeftPct, setThumbLeftPct] = useState(0);

  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [isDraggingContent, setIsDraggingContent] = useState(false);

  // Calculate and sync scrollbar dimensions
  const updateMetrics = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { clientWidth, scrollWidth, scrollLeft } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);

    if (maxScroll > 3) {
      setCanScroll(true);
      const ratio = clientWidth / scrollWidth;
      const widthPct = Math.max(15, Math.min(85, Math.round(ratio * 100)));
      setThumbWidthPct(widthPct);

      const availablePct = 100 - widthPct;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setThumbLeftPct(progress * availablePct);

      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < maxScroll - 4);
    } else {
      setCanScroll(false);
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  }, []);

  // Update metrics on mount, resize, and scroll
  useEffect(() => {
    updateMetrics();

    const el = containerRef.current;
    if (!el) return;

    const handleResize = () => updateMetrics();
    window.addEventListener('resize', handleResize);

    const timer1 = setTimeout(updateMetrics, 50);
    const timer2 = setTimeout(updateMetrics, 200);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateMetrics());
      resizeObserver.observe(el);
      if (el.firstElementChild) {
        resizeObserver.observe(el.firstElementChild);
      }
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [updateMetrics, children]);

  const handleScroll = () => {
    updateMetrics();
  };

  const scrollByAmount = (amount) => {
    const el = containerRef.current;
    if (!el) return;
    try {
      el.scrollBy({ left: amount, behavior: 'smooth' });
    } catch {
      el.scrollLeft += amount;
    }
    setTimeout(updateMetrics, 120);
  };

  /* ─────────────────────────────────────────────────────────────
   * THUMB POINTER DRAGGING (Interactive Scroller)
   * ───────────────────────────────────────────────────────────── */
  const handleThumbPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const el = containerRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!el || !track || !thumb) return;

    const trackRect = track.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const maxScroll = el.scrollWidth - el.clientWidth;

    const state = {
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      maxScroll,
      trackWidth: trackRect.width,
      thumbWidthPx: thumbRect.width,
    };

    setIsDraggingThumb(true);

    const onPointerMove = (moveEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - state.startX;
      const availableTrackWidth = state.trackWidth - state.thumbWidthPx;
      if (availableTrackWidth <= 0) return;

      const scrollDelta = (deltaX / availableTrackWidth) * state.maxScroll;
      el.scrollLeft = Math.max(0, Math.min(state.maxScroll, state.startScrollLeft + scrollDelta));
    };

    const onPointerUp = () => {
      setIsDraggingThumb(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  /* ─────────────────────────────────────────────────────────────
   * TRACK CLICK / TAP (Direct Jump)
   * ───────────────────────────────────────────────────────────── */
  const handleTrackPointerDown = (e) => {
    if (e.target === thumbRef.current || thumbRef.current?.contains(e.target)) return;

    const el = containerRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!el || !track || !thumb) return;

    const trackRect = track.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left;
    const maxScroll = el.scrollWidth - el.clientWidth;

    const availableTrackWidth = trackRect.width - thumbRect.width;
    if (availableTrackWidth <= 0) return;

    const targetRatio = (clickX - thumbRect.width / 2) / availableTrackWidth;
    const boundedRatio = Math.max(0, Math.min(1, targetRatio));
    const targetScroll = boundedRatio * maxScroll;

    el.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  /* ─────────────────────────────────────────────────────────────
   * CONTENT DRAG-TO-SCROLL (Grab and Swipe directly on table)
   * ───────────────────────────────────────────────────────────── */
  const handleContentPointerDown = (e) => {
    // Only drag on left click or touch
    if (e.button !== undefined && e.button !== 0) return;

    // Don't drag if clicking buttons, inputs, links, or dropdowns
    const targetTag = e.target.tagName.toLowerCase();
    if (['button', 'input', 'a', 'select', 'textarea', 'label'].includes(targetTag) || e.target.closest('button, a, input, label')) {
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const startX = e.clientX;
    const startScrollLeft = el.scrollLeft;
    let hasMoved = false;

    const onMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      if (!hasMoved && Math.abs(deltaX) > 4) {
        hasMoved = true;
        setIsDraggingContent(true);
      }
      if (hasMoved) {
        moveEvent.preventDefault();
        el.scrollLeft = startScrollLeft - deltaX;
      }
    };

    const onUp = () => {
      setIsDraggingContent(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  return (
    <div className="table-scroller-wrapper">
      {/* Scroll Hint & Quick Nav Buttons */}
      {showHint && canScroll && (
        <div className="table-scroll-hint-bar">
          <span className="table-scroll-hint-text">
            <span className="hint-icon">↔</span>
            <span className="hint-text-desktop">{hintText}</span>
            <span className="hint-text-mobile">Swipe table to view all</span>
          </span>
          <div className="table-scroll-nav-btns">
            <button
              type="button"
              className="table-scroll-nav-btn"
              disabled={!canScrollLeft}
              onClick={() => scrollByAmount(-220)}
              title="Scroll Left"
              aria-label="Scroll Left"
            >
              ◀ Left
            </button>
            <button
              type="button"
              className="table-scroll-nav-btn"
              disabled={!canScrollRight}
              onClick={() => scrollByAmount(220)}
              title="Scroll Right"
              aria-label="Scroll Right"
            >
              Right ▶
            </button>
          </div>
        </div>
      )}

      {/* Relative container for Left/Right edge overflow gradient shadows */}
      <div className="table-scroller-relative">
        {canScroll && canScrollLeft && (
          <div className="table-scroll-edge-shadow left" aria-hidden="true" />
        )}

        <div
          ref={containerRef}
          className={`table-responsive has-custom-scroller ${isDraggingContent ? 'is-dragging' : ''} ${className}`}
          onScroll={handleScroll}
          onPointerDown={handleContentPointerDown}
          style={minWidth ? { '--table-min-width': `${minWidth}px` } : undefined}
        >
          {children}
        </div>

        {canScroll && canScrollRight && (
          <div className="table-scroll-edge-shadow right" aria-hidden="true" />
        )}
      </div>

      {/* Custom Interactive Draggable Scroller Bar */}
      {canScroll && (
        <div className="table-custom-scroller-bar">
          <button
            type="button"
            className="scroller-arrow-btn left"
            onClick={() => scrollByAmount(-180)}
            disabled={!canScrollLeft}
            title="Scroll Left"
            aria-label="Scroll Left"
          >
            ◀
          </button>

          <div
            ref={trackRef}
            className={`scroller-track ${isDraggingThumb ? 'active' : ''}`}
            onPointerDown={handleTrackPointerDown}
            title="Click or drag scroller"
          >
            <div
              ref={thumbRef}
              className={`scroller-thumb ${isDraggingThumb ? 'dragging' : ''}`}
              style={{
                width: `${thumbWidthPct}%`,
                left: `${thumbLeftPct}%`,
              }}
              onPointerDown={handleThumbPointerDown}
            >
              <span className="scroller-thumb-grip" />
            </div>
          </div>

          <button
            type="button"
            className="scroller-arrow-btn right"
            onClick={() => scrollByAmount(180)}
            disabled={!canScrollRight}
            title="Scroll Right"
            aria-label="Scroll Right"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default TableScroller;
