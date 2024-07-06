import useSWR from "swr";
import { Contributor, ContributorsProps, fetcher } from "./index";
import { useMemo } from "react";

export function Contributors({ owner, repo, refreshInterval = 60 * 60 * 1000 }: ContributorsProps) {
  const { data, error, isLoading } = useSWR<Contributor[]>(
    `https://api.github.com/repos/${owner}/${repo}/contributors`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval,
    },
  );

  if (isLoading) return <div aria-live="polite">Loading...</div>;
  if (error) return <div aria-live="assertive">Error: {error.message}</div>;
  if (!data || data.length === 0) return <div>No contributors found.</div>;

  const sortedContributors = useMemo(() => {
    return [...data].sort((a, b) => b.contributions - a.contributions);
  }, [data]);

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
