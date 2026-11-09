'use client';

/**
 * ContactCards — copy-email button plus icon row with morphing hover cards.
 * Adapted for the portfolio with strict restraint: flat white surface,
 * hairline borders, no shadows, no gradients, no blur filters.
 */

import {
  Fragment,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';

export type ContributionDay = {
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  count: number;
  /** 0–4. Derived from `count` when omitted. */
  level?: 0 | 1 | 2 | 3 | 4;
};

export type ContactLink = {
  label: string;
  href: string;
  icon: ReactNode;
  /** Shown above the row while this link is hovered. */
  card: ReactNode;
};

export type ContactCardsProps = {
  /** Adds the copy button. */
  email?: string;
  /** Adds the GitHub icon and its card with contribution graph. */
  github?: {
    username: string;
    url?: string;
    days?: ContributionDay[];
    avatar?: ReactNode;
  };
  /** Extra links, rendered after GitHub. */
  links?: ContactLink[];
  labels?: { copy?: string; copied?: string; contributions?: string };
  locale?: string;
  className?: string;
};

const LEVELS = [
  'bg-[hsl(0_0%_6%/0.08)]',
  'bg-[hsl(0_0%_6%/0.25)]',
  'bg-[hsl(0_0%_6%/0.45)]',
  'bg-[hsl(0_0%_6%/0.70)]',
  'bg-[hsl(0_0%_6%/1.00)]',
];

const KEYFRAMES = `
@keyframes cc-in {
  from { opacity: 0; transform: translateX(calc(var(--cc-dir, 1) * 64px)); }
}
@keyframes cc-out {
  to { opacity: 0; transform: translateX(calc(var(--cc-dir, 1) * -64px)); }
}
@media (prefers-reduced-motion: reduce) {
  @keyframes cc-in { from { opacity: 0; } }
  @keyframes cc-out { to { opacity: 0; } }
}
`;

export default function ContactCards({
  email,
  github,
  links = [],
  labels,
  locale = 'en-US',
  className = '',
}: ContactCardsProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [outgoing, setOutgoing] = useState<{ index: number; direction: number; key: number }>();
  const [entryKey, setEntryKey] = useState(0);
  const [box, setBox] = useState({ left: 0, width: 0, height: 0 });
  const [morphing, setMorphing] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateHover = () => setCanHover(hoverQuery.matches);
    const updateMotion = () => setReducedMotion(motionQuery.matches);

    updateHover();
    updateMotion();

    hoverQuery.addEventListener('change', updateHover);
    motionQuery.addEventListener('change', updateMotion);

    return () => {
      hoverQuery.removeEventListener('change', updateHover);
      motionQuery.removeEventListener('change', updateMotion);
    };
  }, []);

  // Esc key closes the open card
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setOutgoing(undefined);
        setMorphing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const items: ContactLink[] = [
    ...(github
      ? [
          {
            label: 'GitHub',
            href: github.url ?? `https://github.com/${github.username}`,
            icon: <GithubIcon />,
            card: (
              <GithubCard
                github={github}
                locale={locale}
                contributionsLabel={labels?.contributions ?? 'contributions in the last year'}
              />
            ),
          },
        ]
      : []),
    ...links,
  ];

  useLayoutEffect(() => {
    const content = contentRef.current;
    const link = linkRefs.current[index];
    const wrapper = wrapperRef.current;
    if (!open || !content || !link || !wrapper) return;

    const contentWidth = content.offsetWidth;
    const contentHeight = content.offsetHeight;
    const wrapperRect = wrapper.getBoundingClientRect();
    const unclampedCenter = link.offsetLeft + link.offsetWidth / 2;

    // Clamp horizontal position so card is at least 16px from viewport left and right
    const minCenter = 16 - wrapperRect.left + contentWidth / 2;
    const maxCenter = window.innerWidth - 16 - wrapperRect.left - contentWidth / 2;

    let targetCenter = unclampedCenter;
    if (minCenter <= maxCenter) {
      targetCenter = Math.min(Math.max(unclampedCenter, minCenter), maxCenter);
    } else {
      targetCenter = (minCenter + maxCenter) / 2;
    }

    setBox({
      left: targetCenter,
      width: contentWidth,
      height: contentHeight,
    });
  }, [open, index]);

  useEffect(() => {
    if (!outgoing) return;
    const timeout = setTimeout(() => setOutgoing(undefined), reducedMotion ? 50 : 400);
    return () => clearTimeout(timeout);
  }, [outgoing, reducedMotion]);

  function handleEnter(next: number) {
    if (!canHover) return;
    if (open && next === index) return;
    if (open) {
      setOutgoing({ index, direction: Math.sign(next - index) || 1, key: entryKey });
      setDirection(Math.sign(next - index) || 1);
    }
    setMorphing(open && !reducedMotion);
    setIndex(next);
    setEntryKey((key) => key + 1);
    setOpen(true);
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <style>{KEYFRAMES}</style>

      {email && <CopyEmailButton email={email} labels={labels} />}

      <div
        ref={wrapperRef}
        className="relative flex items-center gap-1"
        onMouseLeave={() => {
          setOpen(false);
          setOutgoing(undefined);
          setMorphing(false);
        }}
      >
        {items.map((item, itemIndex) => (
          <a
            key={item.label}
            ref={(node) => {
              linkRefs.current[itemIndex] = node;
            }}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            onMouseEnter={() => handleEnter(itemIndex)}
            onFocus={() => handleEnter(itemIndex)}
            className="z-10 p-2 text-foreground/75 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            {item.icon}
          </a>
        ))}

        <div
          aria-hidden={!open}
          style={{
            left: box.left,
            width: box.width,
            height: box.height,
            contain: 'paint',
          }}
          className={`absolute bottom-[calc(100%+0.5rem)] flex origin-bottom items-end overflow-hidden rounded-[var(--radius,0px)] bg-[var(--cc-surface)] border border-[hsl(0_0%_6%/0.20)]
            ${
              reducedMotion
                ? 'transition-opacity duration-150 ease-out'
                : morphing
                  ? 'transition-[left,width,height,opacity,transform] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]'
                  : 'transition-[opacity,transform] duration-200 ease-out'
            }
            ${
              open
                ? '-translate-x-1/2 scale-100 opacity-100'
                : reducedMotion
                  ? 'pointer-events-none -translate-x-1/2 opacity-0'
                  : 'pointer-events-none -translate-x-1/2 translate-y-1 scale-[0.97] opacity-0'
            }`}
        >
          {outgoing && (
            <div
              key={`out-${outgoing.key}`}
              onAnimationEnd={(event) => {
                if (event.target === event.currentTarget) setOutgoing(undefined);
              }}
              style={
                {
                  '--cc-dir': outgoing.direction,
                  animation: reducedMotion
                    ? 'none'
                    : 'cc-out 0.35s cubic-bezier(0.32,0.72,0,1) forwards',
                } as CSSProperties
              }
              className="absolute"
            >
              {items[outgoing.index]?.card}
            </div>
          )}
          <div
            key={`in-${entryKey}`}
            ref={contentRef}
            style={
              {
                '--cc-dir': direction,
                animation: reducedMotion
                  ? 'none'
                  : morphing
                    ? 'cc-in 0.4s cubic-bezier(0.32,0.72,0,1) backwards'
                    : undefined,
              } as CSSProperties
            }
            className="absolute"
          >
            {items[index]?.card}
          </div>
        </div>

        {/* Pointer bridge, so the card stays open while moving towards it. */}
        <div className="absolute inset-0 -top-2" />
      </div>
    </div>
  );
}

/**
 * Copies without leaving the page: async clipboard API, then legacy execCommand,
 * then showing the email address to copy manually.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* fallback to execCommand */
  }
  try {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
  } catch {
    return false;
  }
}

export function CopyEmailButton({
  email,
  labels,
  className = '',
}: {
  email: string;
  labels?: { copy?: string; copied?: string };
  className?: string;
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  async function copy() {
    const copied = await copyText(email);
    setState(copied ? 'copied' : 'manual');
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setState('idle'), copied ? 3000 : 8000);
  }

  const label = labels?.copy ?? 'Copy my email';
  const copiedLabel = labels?.copied ?? 'Email copied';

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className={`group relative inline-flex min-h-[44px] px-5 py-2.5 items-center justify-center font-mono text-xs uppercase tracking-wider select-none cursor-pointer border border-primary text-primary hover:text-primary-foreground bg-transparent overflow-hidden transition-all duration-[120ms] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none before:content-[''] before:absolute before:inset-0 before:bg-primary before:origin-left before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300 before:ease-out before:-z-10 motion-reduce:active:scale-100 motion-reduce:transition-none motion-reduce:before:hidden motion-reduce:hover:bg-primary motion-reduce:hover:text-primary-foreground ${className}`}
    >
      <span
        className={`transition-opacity duration-300 ${state === 'idle' ? 'opacity-100' : 'opacity-0'}`}
      >
        {label}
      </span>
      <span
        aria-live="polite"
        className={`absolute transition-opacity duration-300 ${state === 'idle' ? 'opacity-0' : 'opacity-100'}`}
      >
        {state === 'manual' ? email : copiedLabel}
      </span>
    </button>
  );
}

export function Monogram({ className = 'size-9 shrink-0' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" fill="#0A0A0A" />
      <path
        d="M15 50 L32 12 L49 50 M22 37 H42"
        fill="none"
        stroke="#DBFF29"
        strokeWidth="7"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
    </svg>
  );
}

export function GithubCard({
  github,
  locale = 'en-US',
  contributionsLabel,
}: {
  github: NonNullable<ContactCardsProps['github']>;
  locale?: string;
  contributionsLabel: string;
}) {
  const days = github.days ?? [];
  const hasDays = days.length > 0;
  const total = hasDays ? days.reduce((sum, day) => sum + day.count, 0) : 0;
  const avatar = github.avatar ?? <Monogram className="size-9 shrink-0" />;

  return (
    <div className="flex w-[min(22rem,calc(100vw-2.5rem))] flex-col gap-3 p-4 text-[var(--cc-ink)]">
      <div className="flex items-center gap-3">
        {avatar}
        <div className="flex flex-col min-w-0">
          <span className="font-mono text-sm font-semibold tracking-tight truncate">
            {github.username}
          </span>
          <span className="font-mono text-xs text-[var(--cc-muted)] truncate">
            {hasDays
              ? `${total.toLocaleString(locale)} ${contributionsLabel}`
              : `github.com/${github.username}`}
          </span>
        </div>
      </div>
      {hasDays && <ContributionGraph days={days} locale={locale} />}
    </div>
  );
}

/** A year of activity in a 7-row grid, with a tooltip that stays inside the card. */
export function ContributionGraph({
  days,
  locale = 'en-US',
  className = '',
}: {
  days: ContributionDay[];
  locale?: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState<{ day: ContributionDay; left: number; top: number }>();
  const containerRef = useRef<HTMLDivElement>(null);

  const weeks = useMemo(() => {
    if (days.length === 0) return [];
    const result: (ContributionDay | undefined)[][] = [];
    let week: (ContributionDay | undefined)[] = Array.from({
      length: new Date(`${days[0].date}T00:00:00Z`).getUTCDay(),
    });
    for (const day of days) {
      week.push(day);
      if (week.length === 7) {
        result.push(week);
        week = [];
      }
    }
    if (week.length > 0)
      result.push([...week, ...Array.from<undefined>({ length: 7 - week.length })]);
    return result;
  }, [days]);

  const formatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }),
    [locale],
  );

  return (
    <div
      ref={containerRef}
      onPointerOver={(event) => {
        const container = containerRef.current;
        if (!container) return;
        const target = event.target as HTMLElement;
        const { date, count } = target.dataset;
        if (!date) return setHovered(undefined);
        const targetCenter = target.offsetLeft + target.offsetWidth / 2;
        const containerWidth = container.clientWidth;
        const tooltipHalf = 75;
        const left = Math.min(Math.max(targetCenter, tooltipHalf), containerWidth - tooltipHalf);
        setHovered({
          day: { date, count: Number(count) },
          left,
          top: target.offsetTop,
        });
      }}
      onPointerLeave={() => setHovered(undefined)}
      className={`relative flex w-full flex-col gap-2 ${className}`}
    >
      <div
        className="grid grid-flow-col grid-rows-7 gap-[1.5px]"
        style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
      >
        {weeks.map((week, weekIndex) => (
          <Fragment key={weekIndex}>
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                data-date={day?.date}
                data-count={day?.count}
                className={`aspect-square w-full rounded-none ${
                  day ? LEVELS[day.level ?? levelOf(day.count)] : 'bg-transparent'
                }`}
              />
            ))}
          </Fragment>
        ))}
      </div>

      <div
        style={{ left: hovered?.left ?? 0, top: hovered?.top ?? 0 }}
        className={`pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+0.35rem)] rounded-none bg-[var(--cc-ink)] px-2 py-1 font-mono text-[11px] whitespace-nowrap text-[var(--cc-surface)] transition-opacity duration-100 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {hovered
          ? `${hovered.day.count} contribution${hovered.day.count === 1 ? '' : 's'} · ${formatter.format(new Date(`${hovered.day.date}T00:00:00Z`))}`
          : ''}
      </div>
    </div>
  );
}

function levelOf(count: number): 0 | 1 | 2 | 3 | 4 {
  return count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4;
}

export function GithubIcon({ className = 'size-5 fill-current' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon({ className = 'size-5 fill-current' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 1.64-1.64c0-.91-.73-1.64-1.64-1.64a1.64 1.64 0 0 0-1.64 1.64c0 .91.73 1.64 1.64 1.64m1.4 9.74v-8.37H5.06v8.37h2.8Z" />
    </svg>
  );
}

export function LinkedinCard({
  name = 'Abi Kurian Varghese',
  title = 'Computer Science student · Full-stack developer',
  avatar,
}: {
  name?: string;
  title?: string;
  avatar?: ReactNode;
}) {
  return (
    <div className="flex w-[min(20rem,calc(100vw-2.5rem))] flex-col text-[var(--cc-ink)]">
      {/* Flat lemon block (site lemon token, no gradient) */}
      <div className="h-12 w-full bg-[hsl(var(--lemon))]" />
      <div className="p-4 pt-0">
        <div className="-mt-5 mb-3 flex items-end">
          <div className="p-0.5 bg-[var(--cc-surface)]">
            {avatar ?? <Monogram className="size-10 shrink-0" />}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-sm font-semibold tracking-tight text-[var(--cc-ink)]">
            {name}
          </span>
          <span className="font-mono text-xs text-[var(--cc-muted)] leading-relaxed">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}
