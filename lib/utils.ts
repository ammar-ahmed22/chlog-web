import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { ChangelogChange } from "./types";

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
