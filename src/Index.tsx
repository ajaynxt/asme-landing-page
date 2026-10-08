import { useRef, useEffect } from 'react';
import { Globe, ArrowRight, Instagram, Twitter } from 'lucide-react';
import AboutSection from './AboutSection';
import FeaturedVideoSection from './FeaturedVideoSection';
import PhilosophySection from './PhilosophySection';
import ServicesSection from './ServicesSection';

export default function Index() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fadeAnimRef = useRef<number | null>(null);
  const isFadingOutRef = useRef<boolean>(false);
  const isRestartingRef = useRef<boolean>(false);

  // Vanilla JS requestAnimationFrame opacity animator (no CSS transitions)
  const animateOpacity = (from: number, to: number, duration: number, onComplete?: () => void) => {
    if (fadeAnimRef.current) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentVal = from + (to - from) * progress;
      if (videoRef.current) {
        videoRef.current.style.opacity = currentVal.toString();
      }
      if (progress < 1) {
        fadeAnimRef.current = requestAnimationFrame(step);
      } else {
        fadeAnimRef.current = null;
        if (onComplete) onComplete();
      }
    };
    fadeAnimRef.current = requestAnimationFrame(step);
  };

  const handleCanPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
    if (!isFadingOutRef.current && !isRestartingRef.current) {
      const currentOpacity = parseFloat(video.style.opacity || '0');
      if (currentOpacity < 1) {
        animateOpacity(currentOpacity, 1, 500);
      }
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || isFadingOutRef.current || isRestartingRef.current) return;
    const remainingTime = video.duration - video.currentTime;
    if (remainingTime <= 0.55 && remainingTime > 0) {
      isFadingOutRef.current = true;
      const currentOpacity = parseFloat(video.style.opacity || '1');
      animateOpacity(currentOpacity, 0, 500);
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    isRestartingRef.current = true;
    if (fadeAnimRef.current) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }
    video.style.opacity = '0';
    setTimeout(() => {
      const vid = videoRef.current;
      if (!vid) return;
      vid.currentTime = 0;
      vid.play().then(() => {
        isFadingOutRef.current = false;
        isRestartingRef.current = false;
        animateOpacity(0, 1, 500);
      }).catch(() => {
        isFadingOutRef.current = false;
        isRestartingRef.current = false;
      });
    }, 100);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 3) {
      handleCanPlay();
    }
    return () => {
      if (fadeAnimRef.current) {
        cancelAnimationFrame(fadeAnimRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-white/20 selection:text-white">
      {/* SECTION 1 -- HERO (full-viewport) */}
      <section className="min-h-screen overflow-hidden relative flex flex-col justify-between">
        {/* Background Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          style={{ opacity: 0 }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
          muted
          autoPlay
          playsInline
          preload="auto"
          onCanPlay={handleCanPlay}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />

        {/* Navbar */}
        <header className="relative z-20 px-6 py-6 w-full">
          <nav className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-white" />
                <span className="text-white font-semibold text-lg tracking-tight">Asme</span>
              </div>
              <div className="hidden md:flex items-center gap-8 ml-8">
                <a href="#features" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  Pricing
                </a>
                <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  About
                </a>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-white/80 text-sm font-medium transition-colors cursor-pointer">
                Sign Up
              </button>
              <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer">
                Login
              </button>
            </div>
          </nav>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
          {/* Heading */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap font-serif mb-8 select-none">
            Know it <em className="italic">all</em>.
          </h1>

          {/* Email input */}
          <form onSubmit={(e) => e.preventDefault()} className="max-w-xl w-full mb-4">
            <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent text-white placeholder:text-white/40 outline-none flex-1 text-sm md:text-base border-none"
              />
              <button
                type="submit"
                aria-label="Submit"
                className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-colors cursor-pointer flex-shrink-0"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Subtitle */}
          <p className="text-white text-sm leading-relaxed px-4 max-w-lg mx-auto mb-6">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
          </p>

          {/* Manifesto button */}
          <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer">
            Manifesto
          </button>
        </div>

        {/* Social Icons Footer */}
        <div className="relative z-10 flex justify-center gap-4 pb-12">
          <button
            aria-label="Instagram"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <Instagram className="w-5 h-5" />
          </button>
          <button
            aria-label="Twitter"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <Twitter className="w-5 h-5" />
          </button>
          <button
            aria-label="Globe"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* SECTION 2 -- ABOUT */}
      <AboutSection />

      {/* SECTION 3 -- FEATURED VIDEO */}
      <FeaturedVideoSection />

      {/* SECTION 4 -- PHILOSOPHY */}
      <PhilosophySection />

      {/* SECTION 5 -- SERVICES */}
      <ServicesSection />
    </div>
  );
}
