export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

export interface ContributorsProps {
  owner: string;
  repo: string;
}
