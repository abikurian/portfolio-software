'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLenis } from '@/components/providers/SmoothScroll';
import { cn } from '@/lib/utils';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { IBM_Plex_Mono } from 'next/font/google';
import { Container } from '@/components/ui/Container';

const ibmPlexMonoNav = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#stack', label: 'Stack' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const { scrollTo } = useLenis();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      if (currentScrollY > 160 && currentScrollY > lastScrollY.current + 5) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY.current - 5 || currentScrollY <= 160) {
        setIsHidden(false);
      }
      lastScrollY.current = currentScrollY;

      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollTo(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200 py-4',
        isHidden && !mobileMenuOpen ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
        isScrolled
          ? 'bg-background border-b border-border'
          : 'bg-background/95 border-b border-transparent'
      )}
    >
      <Container className="flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollTo(0);
          }}
          className="text-foreground font-anton text-xl tracking-wider uppercase hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="hidden sm:inline">ABI KURIAN VARGHESE</span>
          <span className="sm:hidden">AKV</span>
        </a>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  ibmPlexMonoNav.className,
                  'text-xs tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none py-1 border-b',
                  isActive
                    ? 'text-primary border-primary font-medium'
                    : 'text-muted-foreground border-transparent hover:text-foreground font-normal'
                )}
              >
                {link.label}
              </a>
            );
          })}

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-primary border border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span>Contact</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </nav>

        {/* Mobile menu trigger */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 top-[57px] bg-background z-40 md:hidden flex flex-col px-6 py-8 border-t border-border"
        >
          <nav className="flex flex-col">
            {NAV_LINKS.map((link, idx) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  ibmPlexMonoNav.className,
                  'flex items-center justify-between text-lg tracking-wide uppercase text-foreground hover:text-primary transition-colors py-4 border-b border-border/40 font-normal'
                )}
              >
                <span>{link.label}</span>
                <span className="text-xs text-muted-foreground">0{idx + 1}</span>
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="mt-8 flex items-center justify-between p-3 border border-primary text-primary font-mono uppercase tracking-wider text-xs"
            >
              <span>Get in touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
