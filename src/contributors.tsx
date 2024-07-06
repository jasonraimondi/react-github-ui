import { useState, useEffect } from "react";

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

interface ContributorsProps {
  owner: string;
  repo: string;
}

interface CachedData {
  data: Contributor[];
  timestamp: number;
}

const CACHE_KEY = "github_contributors";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getCachedData(): CachedData | null {
  const cachedData = localStorage.getItem(CACHE_KEY);
  return cachedData ? JSON.parse(cachedData) : null;
}

function setCachedData(data: Contributor[]): void {
  const cacheData: CachedData = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
}

export function Contributors({ owner, repo }: ContributorsProps) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const cachedData = getCachedData();
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
          setContributors(cachedData.data);
          setLoading(false);
          // Revalidate in the background
          fetchFromAPI();
        } else {
          await fetchFromAPI();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setLoading(false);
      }
    };

    const fetchFromAPI = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Contributor[] = await response.json();
        setContributors(data);
        setCachedData(data);
      } catch (err) {
        console.error("Error fetching from API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, [owner, repo]);

  const sortedContributors = contributors.sort((a, b) => b.contributions - a.contributions);

  if (loading) return <div aria-live="polite">Loading...</div>;
  if (error) return <div aria-live="assertive">Error: {error}</div>;

  if (contributors.length === 0) return <div>No contributors found.</div>;

  return (
    <ul className="flex flex-wrap gap-4 list-none" aria-label="Project contributors">
      {sortedContributors.map(contributor => (
        <li key={contributor.login}>
          <a
            href={`https://github.com/${contributor.login}`}
            className="block group"
            title={`${contributor.login} (${contributor.contributions} contributions)`}
          >
            <img
              src={contributor.avatar_url}
              alt={contributor.login}
              width="50"
              height="50"
              loading="lazy"
              className="rounded-full border-2 border-transparent group-hover:border-blue-500 transition-colors duration-200"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
