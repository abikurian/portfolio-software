import type { Metadata } from 'next';
import { Anton, Roboto_Flex, JetBrains_Mono, Inclusive_Sans } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/providers/SmoothScroll';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-roboto-flex',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const inclusiveSans = Inclusive_Sans({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-inclusive-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Abi Kurian Varghese',
    default: 'Abi Kurian Varghese | Full-stack Developer',
  },
  description:
    'Computer Science student in Kochi. I build offline-first web apps and work with local AI models.',
  metadataBase: new URL('https://abikurian.dev'), // {{DOMAIN}}
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://abikurian.dev',
    siteName: 'Abi Kurian Varghese',
    title: 'Abi Kurian Varghese | Full-stack Developer',
    description:
      'Computer Science student in Kochi. I build offline-first web apps and work with local AI models.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abi Kurian Varghese | Full-stack Developer',
    description:
      'Computer Science student in Kochi. I build offline-first web apps and work with local AI models.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${robotoFlex.variable} ${jetbrainsMono.variable} ${inclusiveSans.variable} h-full`}
    >
      <body className="min-h-full antialiased font-roboto">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:text-xs focus:font-mono uppercase"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
