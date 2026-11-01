'use client';

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from '@/components/providers/SmoothScroll';
import { cn } from '@/lib/utils';
import { X, Menu } from 'lucide-react';
import { IBM_Plex_Mono } from 'next/font/google';

const ibmPlexMonoNav = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const { scrollTo, stop, start } = useLenis();
  const [activeSection, setActiveSection] = useState('#home');
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ left: 0, width: 0, opacity: 0 });
  const tabRefs = useRef<Record<string, HTMLElement | null>>({});
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Position highlight over a specific tab element
  const updateHighlight = useCallback((href: string | null) => {
    if (!href) return;
    const el = tabRefs.current?.[href];
    if (el) {
      setCursorPos({
        left: el.offsetLeft,
        width: el.offsetWidth,
        opacity: 1,
      });
    }
  }, []);

  // Track active section using IntersectionObserver with -45% 0 -45% 0 rootMargin
  useEffect(() => {
    const sectionIds = (NAV_ITEMS ?? []).map((item) => item.href.substring(1));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const hash = `#${id}`;
              setActiveSection(hash);
            }
          });
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Keep highlight resting on active tab when not hovering
  useEffect(() => {
    if (!hoveredHref) {
      updateHighlight(activeSection);
    }
  }, [activeSection, hoveredHref, updateHighlight]);

  // Initial highlight placement once mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      updateHighlight(activeSection);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeSection, updateHighlight]);

  // Mobile menu open / close handling + Lenis stop/start
  useEffect(() => {
    if (mobileMenuOpen) {
      stop();
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    } else {
      start();
      document.body.style.overflow = '';
    }
    return () => {
      start();
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, stop, start]);

  // Trap focus & escape key in mobile overlay
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        return;
      }

      if (e.key === 'Tab') {
        const overlay = menuOverlayRef.current;
        if (!overlay) return;

        const focusable = overlay.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollTo(href);
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex items-center justify-center pointer-events-none px-4">
      {/* Desktop / Tablet NavHeader with sliding highlight */}
      <nav
        aria-label="Primary Navigation"
        className="hidden md:block pointer-events-auto"
      >
        <ul
          className={cn(
            ibmPlexMonoNav.className,
            'relative flex items-center bg-background/90 backdrop-blur-md border border-border p-1 shadow-sm'
          )}
          onMouseLeave={() => {
            setHoveredHref(null);
            updateHighlight(activeSection);
          }}
        >
          {(NAV_ITEMS ?? []).map((item) => {
            const isActive = activeSection === item.href;
            const isHovered = hoveredHref === item.href;
            const isHighlighted = isHovered || (!hoveredHref && isActive);

            return (
              <li
                key={item.href}
                ref={(el) => {
                  tabRefs.current[item.href] = el;
                }}
                onMouseEnter={() => {
                  setHoveredHref(item.href);
                  updateHighlight(item.href);
                }}
                className="relative z-10"
              >
                <a
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'block px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
                    isHighlighted
                      ? 'text-primary-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground font-medium'
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}

          {/* Sliding highlight cursor */}
          <motion.li
            aria-hidden="true"
            animate={{
              left: cursorPos.left,
              width: cursorPos.width,
              opacity: cursorPos.opacity,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 32,
            }}
            className="absolute z-0 h-[calc(100%-8px)] top-1 bg-primary pointer-events-none"
          />
        </ul>
      </nav>

      {/* Mobile Menu Button (below md) */}
      <div className="md:hidden w-full flex justify-end pointer-events-auto">
        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-dialog"
          onClick={() => setMobileMenuOpen(true)}
          className={cn(
            ibmPlexMonoNav.className,
            'inline-flex items-center gap-2 px-3.5 py-2 bg-background/90 backdrop-blur-md border border-border text-foreground text-xs uppercase tracking-wider hover:border-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
          )}
        >
          <Menu className="w-4 h-4 text-primary" />
          <span>Menu</span>
        </button>
      </div>

      {/* Full-screen Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-dialog"
            ref={menuOverlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/98 backdrop-blur-lg flex flex-col justify-between p-8 sm:p-12 pointer-events-auto"
          >
            {/* Top row with Close button */}
            <div className="flex items-center justify-between border-b border-border/80 pb-6">
              <span className={cn(ibmPlexMonoNav.className, 'font-mono text-xs uppercase tracking-widest text-primary')}>
                INDEX NAVIGATION
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 border border-border text-foreground hover:border-primary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Staggered slide-up links in large type */}
            <nav className="flex flex-col justify-center my-auto py-8">
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.06,
                    },
                  },
                }}
                className="space-y-4"
              >
                {(NAV_ITEMS ?? []).map((item) => {
                  const isActive = activeSection === item.href;
                  return (
                    <motion.li
                      key={item.href}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                      }}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        aria-current={isActive ? 'true' : undefined}
                        className={cn(
                          'block font-anton text-4xl sm:text-5xl uppercase tracking-tight transition-colors py-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                          isActive ? 'text-primary' : 'text-foreground hover:text-primary'
                        )}
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>

            {/* Bottom metadata footnote */}
            <div className={cn(ibmPlexMonoNav.className, 'pt-6 border-t border-border/80 text-xs text-muted-foreground flex justify-between uppercase')}>
              <span>ABI KURIAN VARGHESE</span>
              <span>2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
