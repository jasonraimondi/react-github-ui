export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

export interface ContributorsProps {
  owner: string;
  repo: string;
  refreshInterval?: number;
}

export function fetcher(url: string) {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  });
}
