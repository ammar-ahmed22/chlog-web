"use client";
import { useSearchParams } from "next/navigation";
import type { ChangelogFile } from "@/lib/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { formatDate } from "@/lib/utils";
import ChangesTable from "@/components/changes-table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import TagFilter from "@/components/ui/tag-filter";
import { matchChange } from "@/lib/utils";
import ShareButton from "@/components/share-button";

export interface EntryViewProps {
  version: string;
  changelog: ChangelogFile;
}

export default function EntryView({
  version,
  changelog,
}: EntryViewProps) {
  const searchParams = useSearchParams();
  const srcParam = searchParams.get("src");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const entry = useMemo(() => {
    return changelog.entries.find(
      (entry) => entry.version === version,
    );
  }, [version, changelog]);

  const allTags = useMemo(() => {
    if (!entry) {
      return [];
    }

    const tags = new Set<string>();
    entry.changes.forEach((change) => {
      change.tags.forEach((tag) => {
        tags.add(tag);
      });
    });
    return Array.from(tags);
  }, [entry]);

  const filteredChanges = useMemo(() => {
    return (
      entry?.changes.filter((change) =>
        matchChange(change, searchQuery, selectedTags),
      ) ?? []
    );
  }, [entry, searchQuery, selectedTags]);

  if (!entry) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="py-24 flex flex-col items-center justify-center h-full">
          <p className="text-xl">Oops!</p>
          <p className="text-muted-foreground">
            Could not find version: {version}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`?src=${encodeURIComponent(srcParam!)}`}>
                Changelog
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Version {entry.version}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <ShareButton />
      </div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">
          Version {entry.version}
        </h1>
        <p className="text-muted-foreground text-sm">
          {formatDate(entry.date)}
        </p>
      </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground text-sm">
          {entry.changes.length} changes
        </p>
        <p className="text-muted-foreground text-sm">
          {entry.from_ref} → {entry.to_ref}
        </p>
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <div className="relative flex-grow">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search changes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onTagSelect={(tag) =>
            setSelectedTags((prev) => [...prev, tag])
          }
          onTagDeselect={(tag) =>
            setSelectedTags((prev) => prev.filter((t) => t !== tag))
          }
        />
      </div>
      <ChangesTable version={version} changes={filteredChanges} />
    </div>
  );
}
