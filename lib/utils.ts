import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { ChangelogChange, ChangelogEntry } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return format(parseISO(dateString), "MMMM d, yyyy");
};

export const matchChange = (
  change: ChangelogChange,
  searchQuery: string,
  selectedTags: string[],
): boolean => {
  const matchesSearch =
    !searchQuery ||
    change.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    change.commits.some((commit) => commit.includes(searchQuery)) ||
    change.tags.some((tag) => tag.includes(searchQuery));

  // Filter by tags
  const matchesTags =
    selectedTags.length === 0 ||
    selectedTags.every((tag) => change.tags.includes(tag));

  return matchesSearch && matchesTags;
};

export const truncateString = (str: string, length: number) => {
  if (str.length <= length) {
    return str;
  }
  return str.substring(0, length) + "...";
};

export const isChangelogEntryArray = (
  data: unknown,
): data is ChangelogEntry[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  for (const entry of data) {
    if (
      typeof entry !== "object" ||
      entry === null ||
      !("version" in entry) ||
      !("date" in entry) ||
      !("changes" in entry) ||
      !("from_ref" in entry) ||
      !("to_ref" in entry)
    ) {
      return false;
    }

    const { version, date, changes, from_ref, to_ref } = entry;

    if (
      typeof version !== "string" ||
      typeof date !== "string" ||
      typeof from_ref !== "string" ||
      typeof to_ref !== "string" ||
      !Array.isArray(changes)
    ) {
      return false;
    }

    for (const change of changes) {
      if (
        typeof change !== "object" ||
        change === null ||
        !("id" in change) ||
        !("title" in change) ||
        !("description" in change) ||
        !("impact" in change) ||
        !("commits" in change) ||
        !("tags" in change)
      ) {
        return false;
      }

      const { id, title, description, impact, commits, tags } =
        change;

      if (
        typeof id !== "string" ||
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof impact !== "string" ||
        !Array.isArray(commits) ||
        !Array.isArray(tags)
      ) {
        return false;
      }
    }
  }

  return true;
};
