import type { ContributionDay } from '@/components/ui/contact-cards';

/**
 * Fetches real GitHub contributions for a user in the last year.
 * Runs on the server with Next.js ISR cache revalidation (86400s / 1 day)
 * and a 5-second timeout.
 */
export async function getContributions(username: string): Promise<ContributionDay[] | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.contributions)) {
      return null;
    }

    const validDays: ContributionDay[] = [];
    for (const item of data.contributions) {
      if (
        typeof item === 'object' &&
        item !== null &&
        typeof item.date === 'string' &&
        typeof item.count === 'number' &&
        !Number.isNaN(item.count)
      ) {
        const level =
          typeof item.level === 'number' && item.level >= 0 && item.level <= 4
            ? (item.level as 0 | 1 | 2 | 3 | 4)
            : undefined;

        validDays.push({
          date: item.date,
          count: item.count,
          level,
        });
      } else {
        return null;
      }
    }

    return validDays;
  } catch {
    return null;
  }
}
