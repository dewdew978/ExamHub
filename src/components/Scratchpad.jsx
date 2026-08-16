import { useState, useRef, useEffect } from 'react';
import { PenTool, X, Maximize2, Minimize2, Trash2, Eraser, Pencil } from 'lucide-react';

export default function Scratchpad() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const ctxRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // Set canvas resolution
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = isEraser ? getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() : getComputedStyle(document.documentElement).getPropertyValue('--text').trim();
      ctx.lineWidth = isEraser ? 16 : 2;
      ctxRef.current = ctx;
    }
  }, [isOpen, isMinimized]); // Re-init canvas when opened or un-minimized

  // Update stroke style when toggling eraser
  useEffect(() => {
    if (ctxRef.current) {
      const surfaceColor = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim();
      const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim();
      
      ctxRef.current.strokeStyle = isEraser ? surfaceColor : textColor;
      ctxRef.current.lineWidth = isEraser ? 16 : 2;
      
      // Fix for dark mode: eraser needs destination-out if we want transparent,
      // but since canvas has solid background we just paint with surface color.
    }
  }, [isEraser]);

  const getCoordinates = (event) => {
    if (!canvasRef.current) return null;
    const canvas = canvasRef.current;
    if (event.touches && event.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      return {
        offsetX: event.touches[0].clientX - rect.left,
        offsetY: event.touches[0].clientY - rect.top
      };
    }
    return {
      offsetX: event.nativeEvent.offsetX,
      offsetY: event.nativeEvent.offsetY
    };
  };

  const startDrawing = (event) => {
    const coords = getCoordinates(event);
    if (!coords) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(coords.offsetX, coords.offsetY);
    isDrawing.current = true;
  };

  const draw = (event) => {
    if (!isDrawing.current) return;
    const coords = getCoordinates(event);
    if (!coords) return;
    ctxRef.current.lineTo(coords.offsetX, coords.offsetY);
    ctxRef.current.stroke();
  };

  const finishDrawing = () => {
    if (ctxRef.current) {
      ctxRef.current.closePath();
    }
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (ctxRef.current && canvas) {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '6.5rem', // Left of calculator
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}
        title="กระดาษทด"
      >
        <PenTool size={24} />
      </button>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: isMinimized ? '2rem' : '2rem',
        right: '6.5rem',
        width: '320px',
        height: isMinimized ? 'auto' : '400px',
        background: 'var(--surface)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px var(--border-divider)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
      className="animate-fade-in"
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        background: 'var(--surface-hover)',
        borderBottom: '1px solid var(--border-divider)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
          <PenTool size={16} style={{ color: 'var(--text-muted)' }} />
          กระดาษทด
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {!isMinimized && (
            <>
              <button 
                onClick={() => setIsEraser(false)}
                style={{ background: !isEraser ? 'var(--border-divider)' : 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}
                title="ดินสอ"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={() => setIsEraser(true)}
                style={{ background: isEraser ? 'var(--border-divider)' : 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}
                title="ยางลบ"
              >
                <Eraser size={16} />
              </button>
              <button 
                onClick={clearCanvas}
                style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}
                title="ลบทั้งหมด"
              >
                <Trash2 size={16} />
              </button>
              <div style={{ width: '1px', background: 'var(--border-divider)', margin: '0 0.25rem' }}></div>
            </>
          )}
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Canvas Body */}
      {!isMinimized && (
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={finishDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={finishDrawing}
          onTouchMove={(e) => {
            // Prevent scrolling while drawing on mobile
            if (isDrawing.current && e.cancelable) {
              e.preventDefault();
            }
            draw(e);
          }}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            cursor: isEraser ? 'crosshair' : 'crosshair',
            background: 'var(--surface)',
            touchAction: 'none' // Important to prevent scrolling on touch devices natively
          }}
        />
      )}
    </div>
  );
}
