import React, { useRef, useState, useEffect } from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className = '' }: PhoneMockupProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentH, setContentH] = useState(844);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;

    const updateDimensions = (width: number, height: number) => {
      if (width > 0) {
        const s = width / 390;
        setScale(s);
        setContentH(height / s);
      }
    };

    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      updateDimensions(rect.width, rect.height);
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        updateDimensions(width, height);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`phone-frame relative flex flex-col items-center shrink-0 ${className}`}>
      {/* Side buttons (neutral-700) */}
      <div className="absolute -left-[3px] top-[19%] h-[4.5%] w-[3px] bg-neutral-700 rounded-l-[2px] pointer-events-none" />
      <div className="absolute -left-[3px] top-[26%] h-[7.3%] w-[3px] bg-neutral-700 rounded-l-[2px] pointer-events-none" />
      <div className="absolute -left-[3px] top-[35.5%] h-[7.3%] w-[3px] bg-neutral-700 rounded-l-[2px] pointer-events-none" />
      <div className="absolute -right-[3px] top-[30.8%] h-[11.4%] w-[3px] bg-neutral-700 rounded-r-[2px] pointer-events-none" />

      {/* Frame */}
      <div className="relative w-full h-full rounded-[clamp(30px,4vw,54px)] bg-black p-[clamp(6px,1vw,12px)] shadow-2xl shadow-black/60">
        {/* Inner ring */}
        <div className="absolute inset-0 rounded-[clamp(30px,4vw,54px)] ring-1 ring-white/15 pointer-events-none" />

        {/* Screen */}
        <div
          ref={screenRef}
          className="relative w-full h-full rounded-[clamp(24px,3.2vw,44px)] overflow-hidden bg-[#0a0e1c]"
        >
          {/* Dynamic Island */}
          <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[30%] h-[4%] bg-black rounded-full z-50 pointer-events-none flex items-center justify-end pr-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0d0d15]/80 ring-1 ring-white/10" />
          </div>

          {/* Scaled Content Container */}
          <div
            style={{
              width: 390,
              height: contentH,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
            className="relative"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
