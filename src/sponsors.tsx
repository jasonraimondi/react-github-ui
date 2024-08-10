import useSWR from "swr";
import { fetcher } from "./index";
import { useEffect, useState } from "react";

interface Sponsor {
  username: string;
  avatar: string;
}

interface SponsorsData {
  current: Sponsor[] | null;
  past: Sponsor[];
}

interface SponsorsResponse {
  status: string;
  sponsors: SponsorsData;
}

interface SponsorsProps {
  username: string;
  refreshInterval?: number;
}

export function Sponsors({ username, refreshInterval = 60 * 60 * 1000 }: SponsorsProps) {
  const LOCAL_STORAGE_NAME = `${username}-sponsors`;

  const { data, error, isLoading } = useSWR<SponsorsResponse>(
    `https://ghs.vercel.app/v3/sponsors/${username}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval,
      onSuccess: data => {
        const sponsors = data.sponsors;
        const all = [...(sponsors.current ?? []), ...(sponsors.past ?? [])];
        setSponsors(all);
      },
    },
  );

  const [sponsors, setSponsors] = useState<Sponsor[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_NAME);
    if (!saved) return [];
    return JSON.parse(saved);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(sponsors));
  }, [sponsors]);

  if (sponsors.length === 0) {
    if (isLoading) return <div aria-live="polite">Loading sponsors...</div>;
    if (error) return <div aria-live="assertive">Error: {error.message}</div>;
    if (!data || data.status !== "success") return <div>No sponsor data available.</div>;
  }

  return (
    <>
      {sponsors.length > 0 ? (
        <ul className="flex flex-wrap gap-4 list-none pl-0" aria-label="Project sponsors">
          {sponsors.map(sponsor => (
            <li key={sponsor.username}>
              <a
                href={`https://github.com/${sponsor.username}`}
                className="block group"
                title={`${sponsor.username}`}
              >
                <img
                  src={sponsor.avatar}
                  alt={sponsor.username}
                  width="50"
                  height="50"
                  loading="lazy"
                  className="rounded-full border-2 border-transparent group-hover:border-blue-500 transition-colors duration-200"
                />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No sponsors.</p>
      )}
    </>
  );
}
