import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Work } from '@/components/sections/Work';
import { Stack } from '@/components/sections/Stack';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" className="relative z-10 flex flex-col">
        <Hero />
        <About />
        <Work />
        <Stack />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
