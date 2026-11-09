import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Work } from '@/components/sections/Work';
import { Stack } from '@/components/sections/Stack';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';
import FlowArt from '@/components/ui/story-scroll';
import { getContributions } from '@/lib/github-contributions';

export default async function Home() {
  const githubDays = await getContributions('abikurian');

  return (
    <>
      <Header />
      <main id="main-content" className="relative z-10 flex flex-col">
        {/* Stack A: Hero (id "home") then About (id "about") */}
        <FlowArt>
          <Hero />
          <About />
        </FlowArt>

        {/* Work (id "work") stays a normal, non-stacked section between the stacks */}
        <Work />

        {/* Stack B: Skills (id "skills"), Experience (id "experience"), Contact (id "contact") */}
        <FlowArt>
          <Stack />
          <Experience />
          <Contact githubDays={githubDays ?? []} />
        </FlowArt>
      </main>
    </>
  );
}
