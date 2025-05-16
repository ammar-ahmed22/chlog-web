export type ChangelogChange = {
  id: string;
  title: string;
  description: string;
  impact: string;
  commits: string[];
  tags: string[];
};

export type ChangelogEntry = {
  version: string;
  date: string;
  from_ref: string;
  to_ref: string;
  changes: ChangelogChange[];
};

export type ChangelogFile = {
  title: string;
  description: string;
  repository: string;
  entries: ChangelogEntry[];
};
