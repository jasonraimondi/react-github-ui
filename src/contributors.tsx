import useSWR from "swr";
import { Contributor, ContributorsProps, fetcher } from "./index";
import { useEffect, useMemo, useState } from "react";

export function Contributors({ owner, repo, refreshInterval = 60 * 60 * 1000 }: ContributorsProps) {
  const LOCAL_STORAGE_NAME = `${owner}-${repo}-contributors`;

  const { data, error, isLoading } = useSWR<Contributor[]>(
    `https://api.github.com/repos/${owner}/${repo}/contributors`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval,
      onSuccess: data => {
        const sortedContributors = [...data].sort((a, b) => b.contributions - a.contributions);
        setContributors(sortedContributors);
      },
    },
  );

  const [contributors, setContributors] = useState<Contributor[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_NAME);
    if (!saved) return [];
    return JSON.parse(saved);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(contributors));
  }, [contributors]);

  if (contributors.length === 0) {
    if (isLoading) return <div aria-live="polite">Loading...</div>;
    if (error) return <div aria-live="assertive">Error: {error.message}</div>;
    if (!data || data.length === 0) return <div>No contributors found.</div>;
  }

  return (
    <ul className="flex flex-wrap gap-4 list-none pl-0" aria-label="Project contributors">
      {contributors.map(contributor => (
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
